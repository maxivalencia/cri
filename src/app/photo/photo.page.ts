import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { PhotoService } from '../services/photo.service';
import{ GlobalData } from '../global_data';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders , HttpErrorResponse, HttpRequest, HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
@Injectable()
export class PhotoPage {

  imageSource : any;
  id_controle : number = 0;
  nombre_photo : number = 0;
  liste_photo : any;
  photo_name : string = "";
  adresse : string = "";

  photo_data : string = "";

  photo_titre : string = "";

  //photo_a_prendre : string = "";

  //photos : Photo;

  constructor(public http: HttpClient, public globalData: GlobalData, private router: Router) {
    /* if(this.globalData.getIdUser() == 0){
      this.router.navigate(['/login']);
    } */
    this.id_controle = this.globalData.getIdControle();
    this.nombre_photo = this.globalData.getNombrePhoto();
    this.liste_photo = this.globalData.getListePhoto();
    this.adresse = this.globalData.getIpAddress();
    this.photo_titre = this.liste_photo[0];
  }

  /* ngOnInit() {
  } */

  /* takePicture = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false,
    });
  }; */

  takePicture = async () => {
    const image = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100,
      allowEditing : false,
      saveToGallery : true,
    });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(image);
    //this.photos.unshift(savedImageFile);

    //this.imageSource = 'data:image/jpeg;base64' + image.base64String;
    this.imageSource = image;
    //console.log("Tonga eto");
    if(this.id_controle != 0 && this.nombre_photo > 0){
      //while(this.nombre_photo > 0){
        //this.takePicture;
        this.photo_titre = this.liste_photo[this.globalData.getNombrePhoto() - this.nombre_photo];
        this.photo_name = this.liste_photo[this.nombre_photo - 1];
        this.sendPhoto(this.photo_name);
        /* this.photo_data = "?photo=" + this.imageSource;
        this.photo_data += "&controle_id=" + this.id_controle;
        this.photo_data += "&photo_name=" + this.photo_name;
        this.http.get(this.adresse + "upload_photo" + this.photo_data); */
        this.nombre_photo--;
      //}
      if(this.nombre_photo <= 0){
        this.router.navigate(['/home']);
      }
    }
    if(this.nombre_photo <= 0){
      this.router.navigate(['/home']);
    }
    this.photo_titre = this.photo_name;

    //console.log(this.imageSource)
  };

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public sendPhoto(photo_name : string) {
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
    //headers.set('Content-Type', 'application/json; charset=UTF-8');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  //sendPhoto = async () => {
    //this.photo_data = "?photo=" + this.imageSource;
    this.photo_data = "?photo=" + this.imageSource;
    this.photo_data += "&controle_id=" + this.id_controle;
    this.photo_data += "&photo_name=" + photo_name;
    //console.log(this.adresse + " <- io ilay url");
    //return this.http.post(this.adresse + "upload_photo", this.photo_data);

    let formData = new FormData();
    formData.append('photo', 'data:image/jpeg;base64,' + this.imageSource.base64String);
    //formData.append('photo', 'teste');
    formData.append('controle_id', this.id_controle.toString());
    formData.append('photo_name', photo_name);
    console.log(formData);
    //return this.http.get(this.adresse + "upload_photo" + this.photo_data);
    return this.http.post(this.adresse + "upload_photo", formData, { headers: new HttpHeaders({'Content-Type': 'multipart/form-data'}) });
    //return this.http.post(this.adresse + "upload_photo", formData);
    /* const req = new HttpRequest('POST', this.adresse + "upload_photo",
    formData, {
     headers: headers,
     reportProgress: true,
     responseType: 'text'
    });
    return this.http.request(req); */
  }

  /* public prendrePhoto(){
    if(this.id_controle != 0 && this.nombre_photo > 0 && this.nombre_photo == this.liste_photo.length){
      while(this.nombre_photo > 0){
        this.takePicture;
        this.photo_name = this.liste_photo[this.nombre_photo - 1];
        this.sendPhoto(this.photo_name);
        this.nombre_photo--;
      }
      //if(this.nombre_photo <= 0){
      //  this.router.navigate(['/home']);
      //}
    }
  } */

}
