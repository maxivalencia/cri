import { Component, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
//import 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  anomalies: any;
  papiers: any;
  // adresse: string = "http://192.168.12.251:2057/liste/";
  adresse: string = "";

  constructor(public http: HttpClient) {
    console.log('Début chargement des constructeur');
    //var _this = this;
    this.getAddress().subscribe((adresse : any) => {
      this.adresse = adresse.trim() + "/cri/";
      var adr : string = adresse.trim() + "/cri/";
      this.changeAdresse(adr);
      this.getAnomaliesJSON().subscribe(anomalies => {
        console.log(anomalies);
        this.anomalies = anomalies;
      });
      this.getPapiersJSON().subscribe(papiers => {
        console.log(papiers);
        this.papiers = papiers;
      });
    })
    console.log('Fin chargement des constructeur');
  }


  ngOnIt() {
    console.log('Début initialisation page home');
    console.log('Fin initialisation page home');
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

  public changeAdresse(adresse : string) {
    console.log(adresse);
    this.adresse = adresse;
  }

  public sleep(ms: number): Promise<void> {
    return new Promise(
        (resolve) => setTimeout(resolve, ms));
  }
}
