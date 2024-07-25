import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.page.html',
  styleUrls: ['./consultation.page.scss'],
})
export class ConsultationPage implements OnInit {
  loading: HTMLIonLoadingElement | null = null;
  immatriculation: string = "";
  adresse = "";
  resultat : any;
  content_visite_visibility = "";
  public segment_visite: string = "visite";
  show_menu = true;

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
      message: 'Connexion en cours...',
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
      this.dismissLoading();
      return this.resultat;
    } catch (error){
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

  visiteTabChanged(ev: any) {
    this.segment_visite = ev.detail.value;
  }

  ionViewWillEnter(){
    this.cleanData();
    this.globalData.setShowMenu(this.show_menu);
  }

  cleanData(){
    this.resultat = "";
    this.immatriculation = "";
    this.content_visite_visibility = "";
  }
}
