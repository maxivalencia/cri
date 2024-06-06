import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-contre',
  templateUrl: './contre.page.html',
  styleUrls: ['./contre.page.scss'],
})
export class ContrePage implements OnInit {

  anomalies: any;
  papiers: any;
  // adresse: string = "http://192.168.12.251:2057/liste/";
  adresse: string = "";

  immatriculation: string = "";
  nom_chauffeur: string = "";
  contact_chauffeur: string = "";
  feuille_de_controle: string = "";
  proprietaire: string = "";
  contact_proprietaire: string = "";
  lieu_de_controle: string = "";
  anomalies_constater: string = "";
  papiers_retirer: string = "";
  papier_reguler: string = "";
  date_controle: string = "";
  date_recuperation: string = "";
  date_limite: string = "";
  mise_en_fourriere: string = "";
  photo: string = "";
  verificateur: string = "";
  centre: string = "";
  id : any;

  showCalendar = false;
  showCalendarFin = false;

  visibility_message = "";
  visibility_content = "";
  message = "Ce véhicule ne figure pas dans notre base pour un contre inopiné";
  resultat : any;

  image_url = "https://dgsrmada.com:2057/uploads/photo/";
  photo_liste : any;
  anomalie_liste : any;
  show_menu = true;

  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    if(this.globalData.getIdUser() <= 0 || this.globalData.getUserAccessLevel() > 3){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    console.log('Début initialisation page home');
    /* this.getAddress().subscribe((adresse : any) => {
      this.adresse = adresse.trim() + "/cri/";
      this.globalData.setIpAddress(this.adresse);
    }); */
  }

  public sendRegulatisationClick() {
    /* console.log(this.photo_liste);
    console.log(this.anomalie_liste); */
    this.globalData.setIdControle(this.id);
    this.globalData.setNombrePhoto(this.photo_liste.length + 1);
    this.globalData.setListePhoto(this.anomalie_liste);
    this.router.navigate(['/photocontre']);
  }

  async rechercherClick(){
    // return this.http.get("./assets/data/anomalies.json");
    try {
      const adresse : any = await this.getAddress().toPromise();
      this.adresse = adresse.trim();
      this.globalData.setIpAddress(this.adresse + '/cri/');
      this.resultat = await this.http.get(this.adresse + "/cri/recuperation/Info/contre?immatriculation=" + this.immatriculation).toPromise();
      console.log(this.resultat);
      //return this.http.get(this.adresse + "/ct/service/mobile/recherche?IMM=" + this.immatriculation);
      //return this.http.get(this.adresse + "/ct/identification/visite?numero=" + this.qrResult["identification"]);
      //this.immatriculation = this.resultat[""];
      this.id = this.resultat["id"];
      this.nom_chauffeur = this.resultat["nom_chauffeur"];
      this.contact_chauffeur = this.resultat["contact_chauffeur"];
      this.feuille_de_controle = this.resultat["numero_feuille"];
      this.proprietaire = this.resultat["nom_proprietaire"];
      this.contact_proprietaire = this.resultat["contact_proprietaire"];
      this.lieu_de_controle = this.resultat["lieu_controle"];
      this.anomalies_constater = this.resultat["anomalie_constater"];
      this.papiers_retirer = this.resultat["papier_retirer"];
      this.papier_reguler = this.resultat["papier_reguler"];
      this.date_controle = this.resultat["date_controle"];
      this.date_recuperation = this.resultat["date_recuperation"];
      this.date_limite = this.resultat["date_limite"];
      this.mise_en_fourriere = this.resultat["mise_en_fourriere"]==true?"Oui":"Non";
      this.photo = this.resultat["photo"];
      this.verificateur = this.resultat["verificateur"];
      this.centre = this.resultat["centre"];
      this.photo_liste = this.photo.split("-");
      const anm = "FACE-" + this.anomalies_constater;
      this.anomalie_liste = anm.split("-");
      if(!this.papier_reguler){
        this.visibility_content = "show";
        this.visibility_message = "";
      }else{
        this.visibility_content = "";
        this.visibility_message = "show";
      }
      return this.resultat;
    } catch (error){
      this.visibility_message = "show";
      return null;
    }
  }

  public getAddress(): Observable<any> {
    return this.http.get("assets/data/adresse.txt", {responseType: 'text'});
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
  openCalendar() {
    this.showCalendar = true;
  }
  cancelCalendar() {
    this.showCalendar = false;
  }
  openCalendarFin() {
    this.showCalendarFin = true;
  }
  cancelCalendarFin() {
    this.showCalendarFin = false;
  }

  ionViewWillEnter(){
    this.cleanData();
    this.globalData.setShowMenu(this.show_menu);
  }

  cleanData(){
    this.immatriculation = "";
    this.visibility_content = "";
    this.visibility_message = "";
  }
}
