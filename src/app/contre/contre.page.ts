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
  anomalies_constater: any = 0;
  papiers_retirer: any = 0;
  date_recuperation: string = new Date().toISOString();
  date_fin_recuperation: string = new Date().toISOString();
  mise_en_fourriere: boolean = false;

  showCalendar = false;
  showCalendarFin = false;
  
  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    /* if(this.globalData.getIdUser() == 0){
      this.router.navigate(['/login']);
    } */
  }

  ngOnInit() {
    let test = 0;
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

  sendRegulatisationClick(){}
}
