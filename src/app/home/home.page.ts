import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { count, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
//import 'rxjs/Rx';
import{ GlobalData } from '../global_data';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Pour ngModel
import { IonicModule, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
/* @Injectable() */
export class HomePage implements OnInit {

  access_level : number = 10;

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
  anomalies_constater: any = 0;
  papiers_retirer: any = 0;
  date_recuperation: string = new Date().toISOString();
  date_fin_recuperation: string = new Date().toISOString();
  mise_en_fourriere: boolean = false;

  controle_data : string = "";
  ctrl : any;

  showCalendar = false;
  showCalendarFin = false;
  show_menu = true;

  constructor(
    public http: HttpClient,
    public globalData: GlobalData,
    private router: Router,
    public platform: Platform
  ) {
    if(this.globalData.getIdUser() <= 0 || this.globalData.getUserAccessLevel() > 4){
      this.router.navigate(['/login']);
    }
    this.access_level = this.globalData.getUserAccessLevel();
  }


  ngOnInit() {
    this.access_level = this.globalData.getUserAccessLevel();
    console.log('Début initialisation page home');
    this.getAddress().subscribe((adresse : any) => {
      this.adresse = adresse.trim() + "/cri/";
      this.globalData.setIpAddress(this.adresse);
      this.getAnomaliesJSON().subscribe(anomalies => {
        this.anomalies = anomalies;
        var aucun_anomalie = {
          "id": this.anomalies.length + 1,
          "code": "AUCUN"
        };
        this.anomalies.push(aucun_anomalie);
        //this.anomalies_constater = [this.anomalies.length];
      });
      this.getPapiersJSON().subscribe(papiers => {
        this.papiers = papiers;
        var aucun_papier = {
          "id": this.papiers.length + 1,
          "papier": "AUCUN"
        };
        this.papiers.push(aucun_papier);
        //this.papiers_retirer = [this.papiers.length];
      });
    });
  }

  public getAnomaliesJSON(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "anomalies");
  }

  public getPapiersJSON(): Observable<any> {
    // return this.http.get("./assets/data/papiers.json");
    return this.http.get(this.adresse + "papiers");
  }

  public getAddress(): Observable<any> {
    return this.http.get("assets/data/adresse.txt", {responseType: 'text'});
  }

  /* public changeAdresse(adresse : string) {
    //console.log(adresse);
    this.adresse = adresse;
  } */

  public sleep(ms: number): Promise<void> {
    return new Promise(
        (resolve) => setTimeout(resolve, ms));
  }

  public sendControle() {
    let anomalie = count(this.anomalies_constater);
    let papier = count(this.anomalies_constater);
    this.controle_data = "?user_id=1";
    //this.controle_data = "?user_id=" + this.immatriculation;
    this.controle_data += "&immatriculation=" + this.immatriculation;
    this.controle_data += "&nom_chauffeur=" + this.nom_chauffeur;
    this.controle_data += "&contact_chauffeur=" + this.contact_chauffeur;
    this.controle_data += "&feuille_de_controle=" + this.feuille_de_controle;
    this.controle_data += "&proprietaire=" + this.proprietaire;
    this.controle_data += "&contact_proprietaire=" + this.contact_proprietaire;
    this.controle_data += "&lieu_de_controle=" + this.lieu_de_controle;
    this.controle_data += "&anomalies=" + this.anomalies_constater;
    this.controle_data += "&papiers=" + this.papiers_retirer;
    this.controle_data += "&date_recuperation=" + this.date_recuperation;
    this.controle_data += "&date_fin_recuperation=" + this.date_fin_recuperation;
    this.controle_data += "&mise_en_fourriere=" + this.mise_en_fourriere;
    //console.log(this.controle_data);
    return this.http.get(this.adresse + "validation/service" + this.controle_data);
  }

  public sendControleClick() {
    this.sendControle().subscribe(controle => {
      this.ctrl = controle;
      this.globalData.setIdControle(this.ctrl["id_controle"]);
      this.globalData.setNombrePhoto(this.ctrl["nombre_photo"] + 1);
      this.globalData.setListePhoto(this.ctrl["liste_photo"].split(","));
      //console.log(this.ctrl["liste_photo"]);
      this.router.navigate(['/photo']);
    });
  }

  public quitterClick(){
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

  public changeImmatriculation(){
    this.getInformation().subscribe(information => {
      this.nom_chauffeur = information["nom_chauffeur"];
      this.contact_chauffeur = information["contact_chauffeur"];
      this.proprietaire = information["nom_proprietaire"];
      this.contact_proprietaire = information["contact_proprietaire"];
      //this.papiers_retirer = [this.papiers.length];
    });
  }

  public getInformation(): Observable<any> {
    // return this.http.get("./assets/data/papiers.json");
    return this.http.get(this.adresse + "recuperation_info?immatriculation=" + this.immatriculation);
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

  estUtilisateur(): boolean {
    return this.access_level <= 4;
  }

  estControleur(): boolean {
    return this.access_level <= 3;
  }

  ionViewWillEnter(){
    this.access_level = this.globalData.getUserAccessLevel()
    this.globalData.setShowMenu(this.show_menu);
    /* console.log(this.globalData.getUserAccessLevel());
    this.access_level = 0;
    console.log(this.access_level); */
  }

  public deconnecterClick(){
    this.globalData.setIdUser(0);
    this.globalData.setIdControle(0);
    this.globalData.setIpAddress("");
    this.globalData.setNombrePhoto(0);
    this.globalData.setListePhoto([]);
    this.globalData.setUserAccessLevel(10);
    this.router.navigate(['/login']);
  }
}
