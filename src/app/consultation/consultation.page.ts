import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.page.html',
  styleUrls: ['./consultation.page.scss'],
})
export class ConsultationPage implements OnInit {

  immatriculation: string = "";
  adresse = "";
  resultat : any;
  content_visite_visibility = "";
  public segment_visite: string = "visite";

  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    /* if(this.globalData.getIdUser() == 0 && this.globalData.getUserAccessLevel() <= 4){
      this.router.navigate(['/login']);
    } */
  }

  ngOnInit() {
    /* this.cleanData(); */
  }

  public deconnecterClick(){
    this.globalData.setIdUser(0);
    this.globalData.setIdControle(0);
    this.globalData.setIpAddress("");
    this.globalData.setNombrePhoto(0);
    this.globalData.setListePhoto([]);
    this.router.navigate(['/login']);
    //this.platform.exitApp();
    App.exitApp();
  }

  public getAddressQr(): Observable<any> {
    return this.http.get("assets/data/adresseqr.txt", {responseType: 'text'});
  }

  async getResultRechercheVisite() {
    // return this.http.get("./assets/data/anomalies.json");
    try {
      const adresse : any = await this.getAddressQr().toPromise();
      this.adresse = adresse.trim();
      this.resultat = await this.http.get(this.adresse + "/ct/service/mobile/recherche?IMM=" + this.immatriculation).toPromise();
      //console.log(this.resultat[0]);
      //return this.http.get(this.adresse + "/ct/service/mobile/recherche?IMM=" + this.immatriculation);
      //return this.http.get(this.adresse + "/ct/identification/visite?numero=" + this.qrResult["identification"]);
      this.content_visite_visibility = this.resultat ? "show" : "";
      return this.resultat;
    } catch (error){
      console.error('Erreur rencontrer : ', error);
      return null;
    }
  }

  public rechercherClick(){
    const resultat = this.getResultRechercheVisite();
    console.log(resultat);
  }

  visiteTabChanged(ev: any) {
    this.segment_visite = ev.detail.value;
  }

  ionViewWillEnter(){
    this.cleanData();
  }

  cleanData(){
    this.resultat = "";
    this.immatriculation = "";
    this.content_visite_visibility = "";
  }
}
