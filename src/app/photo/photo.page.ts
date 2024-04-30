import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { PhotoService } from '../services/photo.service';
import{ GlobalData } from '../global_data';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
      resultType : CameraResultType.Base64,
      source : CameraSource.Photos,
      quality : 100,
      allowEditing : false,
      saveToGallery : false,
    });

    this.imageSource = 'data:image/jpeg;base64' + image.base64String;
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

    //console.log(this.imageSource)
  };

  public sendPhoto(photo_name : string) {
  //sendPhoto = async () => {
    this.photo_data = "?photo=" + this.imageSource;
    this.photo_data += "&controle_id=" + this.id_controle;
    this.photo_data += "&photo_name=" + photo_name;
    //console.log(this.controle_data);
    return this.http.get(this.adresse + "upload_photo" + this.photo_data);
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
