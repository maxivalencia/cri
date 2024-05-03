import { Component, Injectable } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
@Injectable()
export class HomePage {

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

  constructor(public http: HttpClient, public globalData: GlobalData, private router: Router) {
    //console.log('Début chargement des constructeur');
    //var _this = this;
    this.getAddress().subscribe((adresse : any) => {
      this.adresse = adresse.trim() + "/cri/";
      this.globalData.setIpAddress(this.adresse);
      /* var adr : string = adresse.trim() + "/cri/";
      this.changeAdresse(adr) */;
      this.getAnomaliesJSON().subscribe(anomalies => {
        //console.log(anomalies);
        this.anomalies = anomalies;
      });
      this.getPapiersJSON().subscribe(papiers => {
        //console.log(papiers);
        this.papiers = papiers;
      });
    })
    /* if(this.globalData.getIdUser() == 0){
      this.router.navigate(['/login']);
    } */
    //console.log('Fin chargement des constructeur');
    //console.log(this.globalData.getIpAddress());
  }


  /* ngOnIt() {
    console.log('Début initialisation page home');
    console.log('Fin initialisation page home');
  } */

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
}
