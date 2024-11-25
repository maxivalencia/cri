import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';
import { LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { Ocr, TextDetections } from '@capacitor-community/image-to-text';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  loading: HTMLIonLoadingElement | null = null;
  immatriculation: string = "";
  adresse = "";
  resultat : any;
  content_visite_visibility = "";
  message_visibility = "";
  message = "le numéro que vous avez scanné n'existe pas";
  public segment_visite: string = "visite";
  show_menu = true;
  nb_res: boolean = false;
  textDetections: any[] = [];

  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage,
    private loadingController: LoadingController
  ) {
    if(this.globalData.getIdUser() <= 0 || this.globalData.getUserAccessLevel() > 4){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    /* this.cleanData(); */
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Recherche des informations en cours...',
      duration: 5000 // durée maximale de l'animation en millisecondes
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

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

  public getAddressQr(): Observable<any> {
    return this.http.get("assets/data/adresseqr.txt", {responseType: 'text'});
  }

  async getResultRechercheVisite() {
    this.presentLoading();
    // return this.http.get("./assets/data/anomalies.json");
    try {
      const adresse : any = await this.getAddressQr().toPromise();
      this.adresse = adresse.trim();
      this.resultat = await this.http.get(this.adresse + "/ct/service/mobile/recherche?IMM=" + this.immatriculation).toPromise();
      //console.log(this.resultat[0]);
      //return this.http.get(this.adresse + "/ct/service/mobile/recherche?IMM=" + this.immatriculation);
      //return this.http.get(this.adresse + "/ct/identification/visite?numero=" + this.qrResult["identification"]);
      this.content_visite_visibility = this.resultat ? "show" : "";
      this.message_visibility = "";
      if(this.content_visite_visibility == "" && !this.nb_res){
        this.message_visibility = "show";
        this.message = "le numéro que vous avez scanné n'existe pas";
      }
      this.dismissLoading();
      this.nb_res = true;
      return this.resultat;
    } catch (error){
      this.message_visibility = "show";
      this.message = "une erreur s'est produite";
      this.nb_res = false;
      console.error('Erreur rencontrer : ', error);
      this.dismissLoading();
      return null;
    }
  }

  public rechercherClick(){
    //this.presentLoading();
    const resultat = this.getResultRechercheVisite();
    console.log(resultat);
    //this.dismissLoading();
  }

  async scanNow() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    const data: TextDetections = await Ocr.detectText({
      filename: photo.path!,
    });

    console.log(data);

    this.textDetections = data.textDetections;
    console.log(this.textDetections);

    // const regex = /^\d{4}[\s\W_]*[a-zA-Z]{2,3}$/;
    const regex = /^\d[\s\W_]*\d[\s\W_]*\d[\s\W_]*\d[\s\W_]*[a-zA-Z][\s\W_]*[a-zA-Z][\s\W_]*[a-zA-Z]?$/;
    for (let detection of data.textDetections) {
      console.log(detection.text);
      if (regex.test(detection.text)) {
        const matches = detection.text.match(/\d|[a-zA-Z]/g);
        if (matches) {
          const digits = matches.filter(char => /\d/.test(char)); // Filtre les chiffres
          const letters = matches.filter(char => /[a-zA-Z]/.test(char)); // Filtre les lettres;
          this.immatriculation = digits.join('') + letters.join('');
          const resultat = this.getResultRechercheVisite();
          console.log(resultat);
        }
      }
    }
  }

  visiteTabChanged(ev: any) {
    this.segment_visite = ev.detail.value;
  }

  ionViewWillEnter(){
    this.cleanData();
    this.globalData.setShowMenu(this.show_menu);
    this.nb_res = false;
  }

  cleanData(){
    this.resultat = "";
    this.immatriculation = "";
    this.content_visite_visibility = "";
  }

}
