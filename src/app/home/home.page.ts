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
  adresse: string = "http://192.168.12.251:2057/liste/";

  constructor(public http: HttpClient) {
    console.log('Chargement des constructeur');
    this.getAddress().subscribe(adresse => {
      console.log(adresse.text());
      this.adresse = adresse.text();
    })
    this.getAnomaliesJSON().subscribe(anomalies => {
      console.log(anomalies);
      this.anomalies = anomalies;
    });
    this.getPapiersJSON().subscribe(papiers => {
      console.log(papiers);
      this.papiers = papiers;
    });
  }


  ngOnIt() {
    console.log('Fin chargement data');
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
    return this.http.get("./assets/data/adresse.txt");
  }
}
