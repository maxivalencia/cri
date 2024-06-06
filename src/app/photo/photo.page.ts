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
import { delay, finalize, map } from 'rxjs/operators';
import { LoadingController, Platform } from '@ionic/angular';
//import { error } from 'jquery';
import { File } from '@ionic-native/file'
import { FileInfo } from '@capacitor/filesystem';
import { App } from '@capacitor/app';
import { Storage } from '@ionic/storage-angular'; // Import Storage

interface LocalFile {
  name : string;
  path : string;
  data : string;
}
const IMAGE_DIR = "cri-stored-images";
@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
//@Injectable()
export class PhotoPage implements OnInit {

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

  images : LocalFile[] = [];
  show_menu = true;

  constructor(
    public http: HttpClient,
    public globalData: GlobalData,
    private router: Router,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private storage: Storage

  ) {
    if(this.globalData.getIdUser() <= 0 || this.globalData.getUserAccessLevel() > 3){
      this.router.navigate(['/home']);
    }
    /* this.id_controle = 1;
    this.nombre_photo = 1;
    this.liste_photo = ["face"]; */
    this.id_controle = this.globalData.getIdControle();
    this.nombre_photo = this.globalData.getNombrePhoto()==1?0:this.globalData.getNombrePhoto();
    this.liste_photo = this.globalData.getListePhoto();
    this.adresse = this.globalData.getIpAddress();
    this.photo_titre = this.liste_photo[0];
    this.loadFiles();
    for(let i = 0; i < this.images.length - 1; i++){
      this.deleteImage(this.images[i]); // Supprimer l'image après l'upload
      delay(1000);
    }
  }

  ngOnInit() {
    this.loadFiles();
    for(let i = 0; i < this.images.length - 1; i++){
      this.deleteImage(this.images[i]); // Supprimer l'image après l'upload
      delay(1000);
    }
  }

  /* takePicture = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false,
    });
  }; */

  // Eto no manomboka ilay fonction vaovao
  async selectImage(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      if (image) {
        await this.saveImage(image);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  }

  async saveImage(photo: Photo): Promise<void> {
    try {
      const base64Data = await this.readAsBase64Image(photo);
      const fileName = `${Date.now()}.jpeg`;
      await Filesystem.writeFile({
        directory: Directory.Data,
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
      });
    } catch (error) {
      console.error("Error saving image:", error);
    }
  }

  async readAsBase64Image(photo: Photo): Promise<string> {
    try {
      if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
          path: photo.path as string,
        });
        return file.data.toString();
      } else {
        const response = await fetch(photo.webPath as string);
        const blob = await response.blob();
        return await this.convertBlobToBase64Image(blob) as string;
      }
    } catch (error) {
      console.error("Error reading image:", error);
      throw error; // Pour permettre la propagation des erreurs
    }
  }

  convertBlobToBase64Image(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  async loadFiles(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Chargement des données...',
    });

    await loading.present();

    try {
      this.images = [];
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: IMAGE_DIR,
      });

      await this.loadFileData(result.files.map((file: FileInfo) => file.name));
    } catch (err) {
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR,
      });
    } finally {
      await loading.dismiss();
    }
  }

  async loadFileData(fileNames: string[]): Promise<void> {
    const promises = fileNames.map(async (f) => {
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath,
      });
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`, // Correction de la syntaxe base64
      });
    });

    await Promise.all(promises); // Charger les fichiers en parallèle
  }

  async deleteImage(file: LocalFile): Promise<void> {
    try {
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path,
      });
      await this.loadFiles(); // Recharger les fichiers après suppression
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  async startUpload(file: LocalFile): Promise<void> {
    try {
      const response = await fetch(file.data);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob, file.name);
      formData.append("controle_id", this.id_controle.toString());
      formData.append("photo_name", file.name);
      await this.uploadData(formData);
    } catch (error) {
      console.error("Error starting upload:", error);
    }
  }

  async uploadData(formData: FormData): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });

    await loading.present();

    try {
      const url = `${this.adresse}upload_photo`;
      //const url = 'http://192.168.12.251:2057/cri/upload_photo'
      await this.http.post(url, formData).pipe(
        finalize(() => {
          loading.dismiss();
        })
      ).toPromise(); // Utilisation de toPromise pour attendre le résultat

      console.log("Upload successful");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }

  async prendrePhoto(): Promise<void> {
    /* if(this.nombre_photo == 1){
      this.nombre_photo = 0
    } */
    try {
      if(this.nombre_photo <= 0){
        this.router.navigate(['/recapitulationinopine']);
      }
      await this.selectImage();
      await delay(1000);
      await this.loadFiles();
      await delay(1000); // Charger les fichiers avant de continuer
      if (this.images.length > 0) {
        //await this.startUpload(this.images[0]);
        await this.startUpload(this.images[this.images.length - 1]);
        await delay(1000);
        //await this.deleteImage(this.images[0]); // Supprimer l'image après l'upload
        await this.deleteImage(this.images[this.images.length - 1]); // Supprimer l'image après l'upload
        await delay(1000);
      }
      this.loadFiles();
      for(let i = 0; i < this.images.length; i++){
        this.deleteImage(this.images[i]); // Supprimer l'image après l'upload
        delay(1000);
      }
      /* for(let i = 0; i < this.images.length; i++){
        await this.deleteImage(this.images[i]); // Supprimer l'image après l'upload
        await delay(1000);
      } */
      if(this.id_controle != 0 && this.nombre_photo > 0){
        //while(this.nombre_photo > 0){
          //this.takePicture;
          this.photo_titre = this.liste_photo[this.globalData.getNombrePhoto() - this.nombre_photo];
          this.photo_name = this.liste_photo[this.nombre_photo - 1];
          if(this.photo_name == ""){
            this.router.navigate(['/recapitulationinopine']);
          }
          //this.sendPhoto(this.photo_name);
          /* this.photo_data = "?photo=" + this.imageSource;
          this.photo_data += "&controle_id=" + this.id_controle;
          this.photo_data += "&photo_name=" + this.photo_name;
          this.http.get(this.adresse + "upload_photo" + this.photo_data); */
          this.nombre_photo--;
        //}
      }
      if(this.nombre_photo <= 0){
        this.router.navigate(['/recapitulationinopine']);
      }
      this.photo_titre = this.photo_name;
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  }

  /* async selectImage(){
    const image = await Camera.getPhoto({
      quality : 100,
      allowEditing : false,
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera
    });
    if(image){
      this.saveImage(image);
    }
  }
  async saveImage(photo: Photo){
    const base64Data = await this.readAsBase64Image(photo);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory : Directory.Data,
      path : `${IMAGE_DIR}/${fileName}`,
      data : base64Data
    });
  }
  async readAsBase64Image(photo: Photo){
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path : photo.path as string
      });
      return file.data;
    }
    else {
      const response = await fetch(photo.webPath as string);
      const blob = await response.blob();
      return await this.convertBlobToBase64Image(blob) as string;
    }
  }
  convertBlobToBase64Image = (blob : Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  async loadFiles(){
    this.images = [];
    const loading = await this.loadingCtrl.create({
      message : 'Chargement des données ...',
    });
    await loading.present();
    Filesystem.readdir({
      directory : Directory.Data,
      path : IMAGE_DIR
    }).then(result => {
      this.loadFileData(result.files);
    }, async err => {
      await Filesystem.mkdir({
        directory : Directory.Data,
        path : IMAGE_DIR
      });
    }).then(_ => {
      loading.dismiss();
    })
  }
  async loadFileData(fileNames : any[]){
    for(let f of fileNames){
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        directory : Directory.Data,
        path : filePath
      });
      this.images.push({
        name : f,
        path : filePath,
        data : `data:image/jpeg:base64,${readFile.data}`
      });
    }
  }
  async deleteImage(file : LocalFile){
    await Filesystem.deleteFile({
      directory : Directory.Data,
      path : file.path
    });
    this.loadFiles();
  }
  async startUpload(file : LocalFile){
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData;
    formData.append('file', blob, file.name);
    formData.append('controle_id', this.id_controle.toString());
    formData.append('photo_name', file.name);
    this.uploadData(formData);
  }
  async uploadData(formData : FormData){
    const loading = await this.loadingCtrl.create({
      message : 'Uploading image ...'
    });
    await loading.present();
    const url = this.adresse + "upload_photo";
    this.http.post(url, formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log(res);
    })
  }

  async prendrePhoto(){
    await this.selectImage();
    await this.loadFiles();
    await this.startUpload(this.images[0]);
    await this.deleteImage(this.images[0]);
  } */

  // Eto no mifarana ilay fonction vaovao

  takePicture = async () => {
    const image = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100,
      allowEditing : false,
      saveToGallery : true,
    });

    // Save the picture and add it to photo collection
    // const savedImageFile = await this.savePicture(image);
    //this.photos.unshift(savedImageFile);

    //this.imageSource = 'data:image/jpeg;base64' + image.base64String;
    //this.imageSource = 'data:image/jpeg;base64' + this.readAsBase64Image(image);
    //this.imageSource = image;
    this.imageSource = 'data:image/jpeg;base64,' + this.readAsBase64Image(image);
    console.log(this.readAsBase64Image(image));
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
        this.router.navigate(['/inopine']);
      }
    }
    if(this.nombre_photo <= 0){
      this.router.navigate(['/inopine']);
    }
    this.photo_titre = this.photo_name;

    //console.log(this.imageSource)
  };

  /* private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    // const base64Data = await this.readAsBase64(photo);
    //const base64Data = 'data:image/jpeg;base64,' + photo;
    const base64Data = 'data:image/jpeg;base64,' + this.readAsBase64(photo);


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
  } */

  dataURItoBlob(dataURI: string): Blob {
    //if (!dataURI || !dataURI.includes(',')) {
      //console.error('Invalid data URI');
      //return null;
    //}
    //try {
      //const uri = encodeURI(dataURI).toString();
      console.log("Original dataURI:", dataURI);
      // Obtenir la partie du contenu après la virgule
      const [metadata, base64Data] = dataURI.split(',');
      if (!base64Data) {
        throw new Error('Invalid data URI structure');
      }
      console.log("dataURI : ", dataURI)
      const uri = dataURI.toString();
      const uri_split:string = uri.split(',')[1];
      /* const byteString = atob(decodeURI(uri_split));
      const mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab) */;

      //const byteString = atob(base64Data);
      const byteString = atob(this.readAsBase64Image(this.imageSource).toString());
      const mimeString = metadata.split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    //} catch (e) {
      //console.error('Error converting data URI to Blob:', e);
      //return null;
    //}
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
    const image_blob = this.dataURItoBlob(this.imageSource);
    let formData = new FormData();
    //formData.append('photo', 'data:image/jpeg;base64,' + this.imageSource.base64String + '.jpeg');
    formData.append('photo', image_blob, photo_name);
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
      //  this.router.navigate(['/inopine']);
      //}
    }
  } */

  public deconnecterClick(){
    this.globalData.setIdUser(0);
    this.globalData.setIdControle(0);
    this.globalData.setIpAddress("");
    this.globalData.setNombrePhoto(0);
    this.globalData.setListePhoto([]);
    this.globalData.setUserAccessLevel(10);
    this.router.navigate(['/login']);
    //this.platform.exitApp();
    App.exitApp();
  }

  ionViewWillEnter(){
    this.globalData.setShowMenu(this.show_menu);
  }
}
