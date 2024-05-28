import { Component, OnInit, Injectable, Directive, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit, OnDestroy {
  scannedResult : any;
  qrResult : any;
  bodyElement : HTMLElement | null;
  content_visibility = "";
  content_visite_visibility = "";
  content_reception_visibility = "";
  content_constatation_visibility = "";
  adresse = "";
  qrResultVisite : any;
  qrResultReception : any;
  qrResultConstatation : any;
  public segment_visite: string = "visite";

  // information visite
  numero_controle = "";
  centre = "";
  type_visite = "";
  usage = "";
  secretaire = "";
  verificateur = "";
  date_visite = "";
  date_expiration = "";
  utilisation = "";
  aptitude = "";
  commune = "";
  anomalie = "";
  // information véhicule
  immatriculation = "";
  proprietaire = "";
  adresse_proprietaire = "";
  telephone = "";
  profession = "";
  carrosserie = "";
  marque = "";
  nombre_place_assises = "";
  nombre_place_debout = "";
  genre = "";
  energie = "";
  puissance = "";
  numero_de_serie = "";
  numero_moteur = "";
  ptac = "";
  cu = "";
  pav = "";

  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    /* if(this.globalData.getIdUser() == 0){
      this.router.navigate(['/login']);
    } */
    /* this.prepare(); */
    this.bodyElement = document.querySelector('body');
  }

  ngOnInit(){
    console.log("Initialisation page scan qr-code");
  }

  prepare = () => {
    BarcodeScanner.prepare();
  };

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
      // the user granted permission
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
      return false;
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      this.prepare();
      await BarcodeScanner.hideBackground();
      this.bodyElement?.classList.add('scanner-active');
      this.bodyElement?.classList.add('qr-code');
      this.content_visibility = "hidden";
      const result = await BarcodeScanner.startScan();
      console.log(result);
      this.scannedResult = result;
      this.getResultQrScanned();
      BarcodeScanner.showBackground();
      this.bodyElement?.classList.remove('scanner-active');
      this.bodyElement?.classList.remove('qr-code');
      this.content_visibility = "";
      if(result?.hasContent) {
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
      else {
        console.log("Aucun contenu trouvé");
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.bodyElement?.classList.remove('scanner-active');
    this.bodyElement?.classList.remove('qr-code');
    this.content_visibility = "";
  }

  ngOnDestroy(): void {
      this.stopScan();
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

  public getResultQr(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "/ct/identification/qr_code?code=" + this.scannedResult);
  }

  public getResultQrVisite(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "/ct/identification/visite?numero=" + this.qrResult["identification"]);
  }

  public getResultQrReception(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "/ct/identification/reception?numero=" + this.qrResult["identification"]);
  }

  public getResultQrConstatation(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "/ct/identification/constatation?numero=" + this.qrResult["identification"]);
  }

  testClick(){
    this.scannedResult = "d01scVZHYjRWZw==";
    this.getResultQrScanned();
  }

  async getResultQrScanned() {
    try {
      const adresse : any = await this.getAddressQr().toPromise();
      this.adresse = adresse.trim();
      const qrResult: any = await this.getResultQr().toPromise();
      this.qrResult = qrResult;
      this.globalData.setTypeOperation(this.qrResult["operation"]);

      switch(this.globalData.getTypeOperation()) {
        case "VT": {
          const qrResultVisite: any = await this.getResultQrVisite().toPromise();
          this.globalData.setVisite(qrResultVisite);
          this.qrResultVisite = this.globalData.getVisite()[0];
          // information visite
          this.numero_controle =  await this.qrResultVisite["numero_controle"];
          this.centre = this.qrResultVisite["centre"];
          this.type_visite = this.qrResultVisite["type_visite"];
          this.usage = this.qrResultVisite["usage"];
          this.secretaire = this.qrResultVisite["secretaire"];
          this.verificateur = this.qrResultVisite["verificateur"];
          this.date_visite = this.qrResultVisite["date_visite"];
          this.date_expiration = this.qrResultVisite["date_expiration"];
          this.utilisation = this.qrResultVisite["utilisation"];
          this.aptitude = this.qrResultVisite["aptitude"];
          this.anomalie = this.qrResultVisite["anomalie"];
          // information véhicule
          this.immatriculation = this.qrResultVisite["immatriculation"];
          this.carrosserie = this.qrResultVisite["carrosserie"];
          this.marque = this.qrResultVisite["marque"];
          this.nombre_place_assises = this.qrResultVisite["nombre_place_assis"];
          this.nombre_place_debout = this.qrResultVisite["nombre_place_debout"];
          this.genre = this.qrResultVisite["genre"];
          this.energie = this.qrResultVisite["source_energie"];
          this.puissance = this.qrResultVisite["puissance"];
          this.numero_de_serie = this.qrResultVisite["numero_serie"];
          this.numero_moteur = this.qrResultVisite["numero_moteur"];
          this.ptac = this.qrResultVisite["poids_total_a_charge"];
          this.cu = this.qrResultVisite["charge_utile"];
          this.pav = this.qrResultVisite["poids_a_vide"];
          // information propriétaire
          this.proprietaire = this.qrResultVisite["nom"] + ' ' + this.qrResultVisite["prenom"];
          this.commune = this.qrResultVisite["commune"];
          this.adresse_proprietaire = this.qrResultVisite["adresse"];
          this.telephone = this.qrResultVisite["telephone"];
          this.profession = this.qrResultVisite["profession"];
          this.content_visite_visibility = this.qrResult["operation"];
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          break;
        }
        case "RT": {
          const qrResultReception: any = await this.getResultQrReception().toPromise();
          console.log(qrResultReception);
          this.qrResultReception = qrResultReception;
          this.content_visite_visibility = "";
          this.content_reception_visibility = this.qrResult["operation"];
          this.content_constatation_visibility = "";
          break;
        }
        case "CAD": {
          const qrResultConstatation: any = await this.getResultQrConstatation().toPromise();
          console.log(qrResultConstatation);
          this.qrResultConstatation = qrResultConstatation;
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = this.qrResult["operation"];
          break;
        }
        default: {
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          break;
        }
      }
    } catch (error){
      console.error('Erreur rencontrer : ', error);
    }
  }

  visiteTabChanged(ev: any) {
    this.segment_visite = ev.detail.value;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
