import { Component, OnInit, Injectable, Directive, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit, OnDestroy {
  loading: HTMLIonLoadingElement | null = null;
  scannedResult : any;
  qrResult : any;
  bodyElement : HTMLElement | null;
  content_visibility = "";
  content_message_visibility = "";
  content_visite_visibility = "";
  content_reception_visibility = "";
  content_constatation_visibility = "";
  content_authenticite_visibility = "";
  content_speciale_visibility = "";
  content_caracteristique_visibility = "";
  content_vente_visibility = "";
  adresse = "";
  qrResultVisite : any;
  qrResultReception : any;
  qrResultConstatation : any;
  qrResultAuthenticite : any;
  qrResultSpeciale : any;
  qrResultCaracteristique : any;
  qrResultVente : any;
  public segment_visite: string = "visite";
  public segment_reception: string = "reception";
  public segment_constatation: string = "constatation";
  public segment_authenticite: string = "authenticite";
  public segment_speciale: string = "speciale";
  public segment_caracteristique: string = "caracteristique";
  public segment_vente: string = "vente";
  show_menu = true;

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
  imprimer = "";
  isVisiteApte: boolean = false;
  // autre information pour les autres services
  option_vitre_fumee = "";
  validite_vitre_fumee= "";
  itineraire_speciale = "";
  validite_speciale = "";
  depart_speciale = "";
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
  //reception
  type_operation = "";
  id_reception = "";
  motif = "";
  type_reception = "";
  date_mise_en_service = "";
  source_energie = "";
  date_reception = "";
  id_vehicule = "";
  cylindre = "";
  poids_a_vide = "";
  charge_utile = "";
  numero_serie = "";
  type = "";
  poids_total_a_charge = "";
  //constatation
  provenance = "";
  divers = "";
  etat = "";
  sec_pers = "";
  sec_march = "";
  protec_env = "";
  numero_ctrl = "";
  date_embarquement = "";
  lieu_embarquement = "";
  date_constatation = "";
  conformite = "";
  observation = "";
  //constatation carte grise
  carrosserie_carte_grise = "";
  type_carte_grise = "";
  genre_carte_grise = "";
  marque_carte_grise = "";
  source_energie_carte_grise = "";
  cylindre_carte_grise = "";
  puissance_carte_grise = "";
  poids_a_vide_carte_grise = "";
  charge_utile_carte_grise = "";
  hauteur_carte_grise = "";
  largeur_carte_grise = "";
  longueur_carte_grise = "";
  numero_serie_carte_grise = "";
  numero_moteur_carte_grise = "";
  typ_car_carte_grise = "";
  ptac_carte_grise = "";
  date_premiere_circulation_carte_grise = "";
  nombre_place_assis_carte_grise = "";
  //constatation corps de véhicule
  carrosserie_corps_vehicule = "";
  type_corps_vehicule = "";
  genre_corps_vehicule = "";
  marque_corps_vehicule = "";
  source_energie_corps_vehicule = "";
  cylindre_corps_vehicule = "";
  puissance_corps_vehicule = "";
  poids_a_vide_corps_vehicule = "";
  charge_utile_corps_vehicule = "";
  hauteur_corps_vehicule = "";
  largeur_corps_vehicule = "";
  longueur_corps_vehicule = "";
  numero_serie_corps_vehicule = "";
  numero_moteur_corps_vehicule = "";
  typ_car_corps_vehicule = "";
  ptac_corps_vehicule = "";
  date_premiere_circulation_corps_vehicule = "";
  nombre_place_assis_corps_vehicule = "";
  //constatation note descriptive
  carrosserie_note_descriptive = "";
  type_note_descriptive = "";
  genre_note_descriptive = "";
  marque_note_descriptive = "";
  source_energie_note_descriptive = "";
  cylindre_note_descriptive = "";
  puissance_note_descriptive = "";
  poids_a_vide_note_descriptive = "";
  charge_utile_note_descriptive = "";
  hauteur_note_descriptive = "";
  largeur_note_descriptive = "";
  longueur_note_descriptive = "";
  numero_serie_note_descriptive = "";
  numero_moteur_note_descriptive = "";
  typ_car_note_descriptive = "";
  ptac_note_descriptive = "";
  date_premiere_circulation_note_descriptive = "";
  nombre_place_assis_note_descriptive = "";

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
    /* this.prepare(); */
    this.bodyElement = document.querySelector('body');
  }

  ngOnInit(){
    console.log("Initialisation page scan qr-code");
    this.content_message_visibility = "";
    this.content_visite_visibility = "";
    this.content_reception_visibility = "";
    this.content_constatation_visibility = "";
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Analyse de votre QR-Code en cours...',
      duration: 5000 // durée maximale de l'animation en millisecondes
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
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
    this.content_message_visibility = "";
    this.content_visite_visibility = "";
    this.content_reception_visibility = "";
    this.content_constatation_visibility = "";
    this.content_authenticite_visibility = "";
    this.content_speciale_visibility = "";
    this.content_caracteristique_visibility = "";
    this.content_vente_visibility = "";
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
    this.globalData.setUserAccessLevel(10);
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
    return this.http.get(this.adresse + "/ct/identification/visite?numero=" + this.qrResult["identification"]);
  }

  public getResultQrReception(): Observable<any> {
    return this.http.get(this.adresse + "/ct/identification/reception?numero=" + this.qrResult["identification"]);
  }

  public getResultQrConstatation(): Observable<any> {
    return this.http.get(this.adresse + "/ct/identification/constatation?numero=" + this.qrResult["identification"]);
  }

  public getResultQrAuthenticite(): Observable<any> {
    return this.http.get(this.adresse + "/ct/identification/authenticite/vitre/fumee?numero=" + this.qrResult["identification"]);
  }

  public getResultQrSpeciale(): Observable<any> {
    return this.http.get(this.adresse + "/ct/identification/visite/technique/speciale?numero=" + this.qrResult["identification"]);
  }

  public getResultQrCaracteristique(): Observable<any> {
    return this.http.get(this.adresse + "/ct/identification/caracteristique?numero=" + this.qrResult["identification"]);
  }

  public getResultQrVente(): Observable<any> {
    return this.http.get(this.adresse + "/ct/identification/vente/speciale?numero=" + this.qrResult["identification"]);
  }

  testClick(){
    // this.scannedResult = "d01scWJMTDRxVg==";
    //this.scannedResult = "d01scTRHZmItYg==";
    this.scannedResult = "dnlscTQ0Sw==";
    this.getResultQrScanned();
  }

  async getResultQrScanned() {
    this.presentLoading();
    try {
      const adresse : any = await this.getAddressQr().toPromise();
      this.adresse = adresse.trim();
      const qrResult: any = await this.getResultQr().toPromise();
      this.qrResult = qrResult;
      console.log("type opération : " + this.qrResult["operation"]);
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
          this.cylindre = this.qrResultVisite["cylindre"];
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
          this.imprimer = this.qrResultVisite["imprime"];

          this.isVisiteApte = this.aptitude=='Apte'?true:false;

          this.content_message_visibility = "";
          this.content_visite_visibility = this.qrResult["operation"];
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
        case "RT": {
          const qrResultReception: any = await this.getResultQrReception().toPromise();
          this.globalData.setReception(qrResultReception);
          this.qrResultReception = this.globalData.getReception()[0];
          // information réception
          this.id_reception = this.qrResultReception["id_reception"];
          this.centre = this.qrResultReception["centre"];
          this.motif = this.qrResultReception["motif"];
          this.type_reception = this.qrResultReception["type_reception"];
          this.secretaire = this.qrResultReception["secretaire"];
          this.utilisation = this.qrResultReception["utilisation"];
          this.date_mise_en_service = this.qrResultReception["date_mise_en_service"];
          this.immatriculation = this.qrResultReception["immatriculation"];
          this.proprietaire = this.qrResultReception["proprietaire"];
          this.profession = this.qrResultReception["profession"];
          this.adresse_proprietaire = this.qrResultReception["adresse"];
          this.nombre_place_assises = this.qrResultReception["nombre_place_assis"];
          this.nombre_place_debout = this.qrResultReception["nombre_place_debout"];
          this.numero_controle = this.qrResultReception["numero_controle"];
          this.energie = this.qrResultReception["source_energie"];
          this.carrosserie = this.qrResultReception["carrosserie"];
          this.date_reception = this.qrResultReception["date"];
          this.genre = this.qrResultReception["genre"];
          this.marque = this.qrResultReception["marque"];
          this.cylindre = this.qrResultReception["cylindre"];
          this.puissance = this.qrResultReception["puissance"];
          this.poids_a_vide = this.qrResultReception["poids_a_vide"];
          this.charge_utile = this.qrResultReception["charge_utile"];
          this.numero_serie = this.qrResultReception["numero_serie"];
          this.numero_moteur = this.qrResultReception["numero_moteur"];
          this.type = this.qrResultReception["type"];
          this.poids_total_a_charge = this.qrResultReception["poids_total_a_charge"];
          this.imprimer = this.qrResultReception["imprime"];

          this.content_message_visibility = "";
          this.content_visite_visibility = "";
          this.content_reception_visibility = this.qrResult["operation"];
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
        case "CAD": {
          const qrResultConstatation: any = await this.getResultQrConstatation().toPromise();
          this.globalData.setConstatation(qrResultConstatation);
          this.qrResultConstatation = this.globalData.getConstatation()[0];
          //constatation
          this.centre = this.qrResultConstatation["centre"];
          this.verificateur = this.qrResultConstatation["verificateur"];
          this.provenance = this.qrResultConstatation["provenance"];
          this.divers = this.qrResultConstatation["divers"];
          this.proprietaire = this.qrResultConstatation["nom_proprietaire"];
          this.adresse_proprietaire = this.qrResultConstatation["adresse_proprietaire"];
          this.etat = this.qrResultConstatation["etat"];
          this.sec_pers = this.qrResultConstatation["sec_pers"];
          this.sec_march = this.qrResultConstatation["sec_march"];
          this.protec_env = this.qrResultConstatation["protec_env"];
          this.numero_ctrl = this.qrResultConstatation["numero_ctrl"];
          this.immatriculation = this.qrResultConstatation["immatriculation"];
          this.date_embarquement = this.qrResultConstatation["date_embarquement"];
          this.lieu_embarquement = this.qrResultConstatation["lieu_embarquement"];
          this.date_constatation = this.qrResultConstatation["date"];
          this.conformite = this.qrResultConstatation["conformite"];
          this.observation = this.qrResultConstatation["observation"];
          this.imprimer = this.qrResultConstatation["imprime"];
          //constatation carte grise
          this.carrosserie_carte_grise = this.qrResultConstatation["carrosserie_carte_grise"];
          this.type_carte_grise = this.qrResultConstatation["type_carte_grise"];
          this.genre_carte_grise = this.qrResultConstatation["genre_carte_grise"];
          this.marque_carte_grise = this.qrResultConstatation["marque_carte_grise"];
          this.source_energie_carte_grise = this.qrResultConstatation["source_energie_carte_grise"];
          this.cylindre_carte_grise = this.qrResultConstatation["cylindre_carte_grise"];
          this.puissance_carte_grise = this.qrResultConstatation["puissance_carte_grise"];
          this.poids_a_vide_carte_grise = this.qrResultConstatation["poids_a_vide_carte_grise"];
          this.charge_utile_carte_grise = this.qrResultConstatation["charge_utile_carte_grise"];
          this.hauteur_carte_grise = this.qrResultConstatation["hauteur_carte_grise"];
          this.largeur_carte_grise = this.qrResultConstatation["largeur_carte_grise"];
          this.longueur_carte_grise = this.qrResultConstatation["longueur_carte_grise"];
          this.numero_serie_carte_grise = this.qrResultConstatation["numero_serie_carte_grise"];
          this.numero_moteur_carte_grise = this.qrResultConstatation["numero_moteur_carte_grise"];
          this.typ_car_carte_grise = this.qrResultConstatation["typ_car_carte_grise"];
          this.ptac_carte_grise = this.qrResultConstatation["ptac_carte_grise"];
          this.date_premiere_circulation_carte_grise = this.qrResultConstatation["date_premiere_circulation_carte_grise"];
          this.nombre_place_assis_carte_grise = this.qrResultConstatation["nombre_place_assis_carte_grise"];
          //constatation corps de véhicule
          this.carrosserie_corps_vehicule = this.qrResultConstatation["carrosserie_corps_vehicule"];
          this.type_corps_vehicule = this.qrResultConstatation["type_corps_vehicule"];
          this.genre_corps_vehicule = this.qrResultConstatation["genre_corps_vehicule"];
          this.marque_corps_vehicule = this.qrResultConstatation["marque_corps_vehicule"];
          this.source_energie_corps_vehicule = this.qrResultConstatation["source_energie_corps_vehicule"];
          this.cylindre_corps_vehicule = this.qrResultConstatation["cylindre_corps_vehicule"];
          this.puissance_corps_vehicule = this.qrResultConstatation["puissance_corps_vehicule"];
          this.poids_a_vide_corps_vehicule = this.qrResultConstatation["poids_a_vide_corps_vehicule"];
          this.charge_utile_corps_vehicule = this.qrResultConstatation["charge_utile_corps_vehicule"];
          this.hauteur_corps_vehicule = this.qrResultConstatation["hauteur_corps_vehicule"];
          this.largeur_corps_vehicule = this.qrResultConstatation["largeur_corps_vehicule"];
          this.longueur_corps_vehicule = this.qrResultConstatation["longueur_corps_vehicule"];
          this.numero_serie_corps_vehicule = this.qrResultConstatation["numero_serie_corps_vehicule"];
          this.numero_moteur_corps_vehicule = this.qrResultConstatation["numero_moteur_corps_vehicule"];
          this.typ_car_corps_vehicule = this.qrResultConstatation["typ_car_corps_vehicule"];
          this.ptac_corps_vehicule = this.qrResultConstatation["ptac_corps_vehicule"];
          this.date_premiere_circulation_corps_vehicule = this.qrResultConstatation["date_premiere_circulation_corps_vehicule"];
          this.nombre_place_assis_corps_vehicule = this.qrResultConstatation["nombre_place_assis_corps_vehicule"];
          //constatation note descriptive
          this.carrosserie_note_descriptive = this.qrResultConstatation["carrosserie_note_descriptive"];
          this.type_note_descriptive = this.qrResultConstatation["type_note_descriptive"];
          this.genre_note_descriptive = this.qrResultConstatation["genre_note_descriptive"];
          this.marque_note_descriptive = this.qrResultConstatation["marque_note_descriptive"];
          this.source_energie_note_descriptive = this.qrResultConstatation["source_energie_note_descriptive"];
          this.cylindre_note_descriptive = this.qrResultConstatation["cylindre_note_descriptive"];
          this.puissance_note_descriptive = this.qrResultConstatation["puissance_note_descriptive"];
          this.poids_a_vide_note_descriptive = this.qrResultConstatation["poids_a_vide_note_descriptive"];
          this.charge_utile_note_descriptive = this.qrResultConstatation["charge_utile_note_descriptive"];
          this.hauteur_note_descriptive = this.qrResultConstatation["hauteur_note_descriptive"];
          this.largeur_note_descriptive = this.qrResultConstatation["largeur_note_descriptive"];
          this.longueur_note_descriptive = this.qrResultConstatation["longueur_note_descriptive"];
          this.numero_serie_note_descriptive = this.qrResultConstatation["numero_serie_note_descriptive"];
          this.numero_moteur_note_descriptive = this.qrResultConstatation["numero_moteur_note_descriptive"];
          this.typ_car_note_descriptive = this.qrResultConstatation["typ_car_note_descriptive"];
          this.ptac_note_descriptive = this.qrResultConstatation["ptac_note_descriptive"];
          this.date_premiere_circulation_note_descriptive = this.qrResultConstatation["date_premiere_circulation_note_descriptive"];
          this.nombre_place_assis_note_descriptive = this.qrResultConstatation["nombre_place_assis_note_descriptive"];

          this.content_message_visibility = "";
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = this.qrResult["operation"];
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
        case "AVF": {
          const qrResultAuthenticite: any = await this.getResultQrAuthenticite().toPromise();
          this.globalData.setAuthenticite(qrResultAuthenticite);
          this.qrResultAuthenticite = this.globalData.getAuthenticite()[0];
          // information autre service
          this.numero_controle =  await this.qrResultAuthenticite["numero_controle"];
          this.centre = this.qrResultAuthenticite["centre"];
          this.secretaire = this.qrResultAuthenticite["secretaire"];
          this.verificateur = this.qrResultAuthenticite["verificateur"];
          this.date_visite = this.qrResultAuthenticite["date_controle"];
          this.validite_vitre_fumee = this.qrResultAuthenticite["date_expiration"];
          this.utilisation = this.qrResultAuthenticite["utilisation"];
          this.option_vitre_fumee = this.qrResultAuthenticite["option_vitre_fumee"];
          this.validite_vitre_fumee= this.qrResultAuthenticite["validite"];
          // information véhicule
          this.immatriculation = this.qrResultAuthenticite["immatriculation"];
          this.carrosserie = this.qrResultAuthenticite["carrosserie"];
          this.marque = this.qrResultAuthenticite["marque"];
          this.cylindre = this.qrResultAuthenticite["cylindre"];
          this.nombre_place_assises = this.qrResultAuthenticite["nombre_place_assis"];
          this.nombre_place_debout = this.qrResultAuthenticite["nombre_place_debout"];
          this.genre = this.qrResultAuthenticite["genre"];
          this.energie = this.qrResultAuthenticite["source_energie"];
          this.puissance = this.qrResultAuthenticite["puissance"];
          this.numero_de_serie = this.qrResultAuthenticite["numero_serie"];
          this.numero_moteur = this.qrResultAuthenticite["numero_moteur"];
          this.ptac = this.qrResultAuthenticite["poids_total_a_charge"];
          this.cu = this.qrResultAuthenticite["charge_utile"];
          this.pav = this.qrResultAuthenticite["poids_a_vide"];
          // information propriétaire
          this.proprietaire = this.qrResultAuthenticite["nom"] + ' ' + this.qrResultAuthenticite["prenom"];
          this.commune = this.qrResultAuthenticite["commune"];
          this.adresse_proprietaire = this.qrResultAuthenticite["adresse"];
          this.telephone = this.qrResultAuthenticite["telephone"];
          this.profession = this.qrResultAuthenticite["profession"];
          this.imprimer = this.qrResultAuthenticite["imprime"];

          this.content_message_visibility = "";
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = this.qrResult["operation"];
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
        case "VTS": {
          const qrResultSpeciale: any = await this.getResultQrSpeciale().toPromise();
          this.globalData.setVisiteTechniqueSpeciale(qrResultSpeciale);
          this.qrResultSpeciale = this.globalData.getVisiteTechniqueSpeciale()[0];
          // information autre service
          this.numero_controle =  await this.qrResultSpeciale["numero_controle"];
          this.centre = this.qrResultSpeciale["centre"];
          this.secretaire = this.qrResultSpeciale["secretaire"];
          this.verificateur = this.qrResultSpeciale["verificateur"];
          this.date_visite = this.qrResultSpeciale["date_controle"];
          this.date_expiration = this.qrResultSpeciale["date_expiration"];
          this.utilisation = this.qrResultSpeciale["utilisation"];
          this.itineraire_speciale = this.qrResultSpeciale["itineraire"];
          this.depart_speciale = this.qrResultSpeciale["depart"];
          this.validite_speciale = this.qrResultSpeciale["validite"];
          // information véhicule
          this.immatriculation = this.qrResultSpeciale["immatriculation"];
          this.carrosserie = this.qrResultSpeciale["carrosserie"];
          this.marque = this.qrResultSpeciale["marque"];
          this.cylindre = this.qrResultSpeciale["cylindre"];
          this.nombre_place_assises = this.qrResultSpeciale["nombre_place_assis"];
          this.nombre_place_debout = this.qrResultSpeciale["nombre_place_debout"];
          this.genre = this.qrResultSpeciale["genre"];
          this.energie = this.qrResultSpeciale["source_energie"];
          this.puissance = this.qrResultSpeciale["puissance"];
          this.numero_de_serie = this.qrResultSpeciale["numero_serie"];
          this.numero_moteur = this.qrResultSpeciale["numero_moteur"];
          this.ptac = this.qrResultSpeciale["poids_total_a_charge"];
          this.cu = this.qrResultSpeciale["charge_utile"];
          this.pav = this.qrResultSpeciale["poids_a_vide"];
          // information propriétaire
          this.proprietaire = this.qrResultSpeciale["nom"] + ' ' + this.qrResultSpeciale["prenom"];
          this.commune = this.qrResultSpeciale["commune"];
          this.adresse_proprietaire = this.qrResultSpeciale["adresse"];
          this.telephone = this.qrResultSpeciale["telephone"];
          this.profession = this.qrResultSpeciale["profession"];
          this.imprimer = this.qrResultSpeciale["imprime"];

          this.content_message_visibility = "";
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = this.qrResult["operation"];
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
        case "CAR": {
          const qrResultCaracteristique: any = await this.getResultQrCaracteristique().toPromise();
          this.globalData.setCaracteristique(qrResultCaracteristique);
          this.qrResultCaracteristique = this.globalData.getCaracteristique()[0];
          // information autre service
          this.numero_controle =  await this.qrResultCaracteristique["numero_controle"];
          this.centre = this.qrResultCaracteristique["centre"];
          this.secretaire = this.qrResultCaracteristique["secretaire"];
          this.verificateur = this.qrResultCaracteristique["verificateur"];
          this.date_visite = this.qrResultCaracteristique["date_controle"];
          this.date_expiration = this.qrResultCaracteristique["date_expiration"];
          this.utilisation = this.qrResultCaracteristique["utilisation"];
          // information véhicule
          this.immatriculation = this.qrResultCaracteristique["immatriculation"];
          this.carrosserie = this.qrResultCaracteristique["carrosserie"];
          this.marque = this.qrResultCaracteristique["marque"];
          this.cylindre = this.qrResultCaracteristique["cylindre"];
          this.nombre_place_assises = this.qrResultCaracteristique["nombre_place_assis"];
          this.nombre_place_debout = this.qrResultCaracteristique["nombre_place_debout"];
          this.genre = this.qrResultCaracteristique["genre"];
          this.energie = this.qrResultCaracteristique["source_energie"];
          this.puissance = this.qrResultCaracteristique["puissance"];
          this.numero_de_serie = this.qrResultCaracteristique["numero_serie"];
          this.numero_moteur = this.qrResultCaracteristique["numero_moteur"];
          this.ptac = this.qrResultCaracteristique["poids_total_a_charge"];
          this.cu = this.qrResultCaracteristique["charge_utile"];
          this.pav = this.qrResultCaracteristique["poids_a_vide"];
          // information propriétaire
          this.proprietaire = this.qrResultCaracteristique["nom"] + ' ' + this.qrResultCaracteristique["prenom"];
          this.commune = this.qrResultCaracteristique["commune"];
          this.adresse_proprietaire = this.qrResultCaracteristique["adresse"];
          this.telephone = this.qrResultCaracteristique["telephone"];
          this.profession = this.qrResultCaracteristique["profession"];
          this.imprimer = this.qrResultCaracteristique["imprime"];

          this.content_message_visibility = "";
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = this.qrResult["operation"];
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
        case "VS": {
          const qrResultVente: any = await this.getResultQrVente().toPromise();
          this.globalData.setVenteSpeciale(qrResultVente);
          this.qrResultVente = this.globalData.getVenteSpeciale()[0];
          // information autre service
          this.numero_controle =  await this.qrResultVente["numero_controle"];
          this.centre = this.qrResultVente["centre"];
          this.secretaire = this.qrResultVente["secretaire"];
          this.verificateur = this.qrResultVente["verificateur"];
          this.date_visite = this.qrResultVente["date_controle"];
          this.date_expiration = this.qrResultVente["date_expiration"];
          this.utilisation = this.qrResultVente["utilisation"];
          // information véhicule
          this.immatriculation = this.qrResultVente["immatriculation"];
          this.carrosserie = this.qrResultVente["carrosserie"];
          this.marque = this.qrResultVente["marque"];
          this.cylindre = this.qrResultVente["cylindre"];
          this.nombre_place_assises = this.qrResultVente["nombre_place_assis"];
          this.nombre_place_debout = this.qrResultVente["nombre_place_debout"];
          this.genre = this.qrResultVente["genre"];
          this.energie = this.qrResultVente["source_energie"];
          this.puissance = this.qrResultVente["puissance"];
          this.numero_de_serie = this.qrResultVente["numero_serie"];
          this.numero_moteur = this.qrResultVente["numero_moteur"];
          this.ptac = this.qrResultVente["poids_total_a_charge"];
          this.cu = this.qrResultVente["charge_utile"];
          this.pav = this.qrResultVente["poids_a_vide"];
          // information propriétaire
          this.proprietaire = this.qrResultVente["nom"] + ' ' + this.qrResultVente["prenom"];
          this.commune = this.qrResultVente["commune"];
          this.adresse_proprietaire = this.qrResultVente["adresse"];
          this.telephone = this.qrResultVente["telephone"];
          this.profession = this.qrResultVente["profession"];
          this.imprimer = this.qrResultVente["imprime"];

          this.content_message_visibility = "";
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = this.qrResult["operation"];
          this.dismissLoading();
          break;
        }
        default: {
          this.content_message_visibility = "QR-Code invalide pour l'application";
          this.content_visite_visibility = "";
          this.content_reception_visibility = "";
          this.content_constatation_visibility = "";
          this.content_authenticite_visibility = "";
          this.content_speciale_visibility = "";
          this.content_caracteristique_visibility = "";
          this.content_vente_visibility = "";
          this.dismissLoading();
          break;
        }
      }
      this.dismissLoading();
    } catch (error){
      console.error('Erreur rencontrer : ', error);
      this.dismissLoading();
    }
  }

  visiteTabChanged(ev: any) {
    this.segment_visite = ev.detail.value;
  }

  receptionTabChanged(ev: any) {
    this.segment_reception = ev.detail.value;
  }

  constatationTabChanged(ev: any) {
    this.segment_constatation = ev.detail.value;
  }

  authenticiteTabChanged(ev: any) {
    this.segment_authenticite = ev.detail.value;
  }

  specialTabChanged(ev: any) {
    this.segment_speciale = ev.detail.value;
  }

  caracteristiqueTabChanged(ev: any) {
    this.segment_caracteristique = ev.detail.value;
  }

  venteTabChanged(ev: any) {
    this.segment_vente = ev.detail.value;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ionViewWillEnter(){
    this.cleanData();
    this.globalData.setShowMenu(this.show_menu);
  }

  cleanData(){
    this.immatriculation = "";
    this.content_message_visibility = "";
    this.content_visite_visibility = "";
    this.content_reception_visibility = "";
    this.content_constatation_visibility = "";
    this.content_authenticite_visibility = "";
    this.content_speciale_visibility = "";
    this.content_caracteristique_visibility = "";
    this.content_vente_visibility = "";
  }
}
