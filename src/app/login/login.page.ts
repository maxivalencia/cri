import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/* @Injectable() */
export class LoginPage implements OnInit {

  username : string = "";
  password : string = "";
  message_connection : string = "";
  adresse : string = "";
  login : string = "";
  auth : any;
  code : any;
  id_user : any;
  access_level : any;

  constructor(public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    if(this.globalData.getIdUser() > 0 && this.globalData.getUserAccessLevel() <= 4){
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    console.log('Initiation page login');
    //this.getLoginToFile();
    this.storage.create();
    this.retrieveData();
  }

  signIn() {
    //console.log("En attente du service d'authentification ...!")
    //var _this = this;
    this.getAddress().subscribe((adresse : any) => {
      this.adresse = adresse.trim();
      this.getAuthentification().subscribe(auth => {
        console.log(auth);
        this.auth = auth;
        this.message_connection = auth["message"];
        if(auth["code"] == 200){
          this.id_user = auth["id_user"];
          this.access_level = auth["access_level"];
          this.globalData.setIdUser(this.access_level);
          this.globalData.setIpAddress(this.adresse);
          this.globalData.setUserAccessLevel(this.access_level);
          this.router.navigate(['/home']);
        }
        //this.setLogin();
        this.deleteData();
        this.storeData();
        this.password = "";
      });
    })
  }

  /* public getLoginToFile() {
    this.getLogin().subscribe((login : any) => {
      this.login = login.trim();
    })
  } */

  public getAddress(): Observable<any> {
    return this.http.get("assets/data/adresse.txt", {responseType: 'text'});
  }

  public getAuthentification(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "/cri/login/service?username=" + this.username + "&password=" + this.password);
  }

  /* public getLogin(): Observable<any> {
    return this.http.get("assets/data/user.txt", {responseType: 'text'});
  }

  public setLogin() {
    //this.http.post("assets/data/user.txt", this.login);
    //return this.http.get("assets/data/user.txt", {responseType: 'text'});
    Filesystem.writeFile({
      path: 'assets/data/user.txt',
      data: this.login,
      //directory: Directory.Documents,
      //encoding: Encoding.UTF8,
    });
  } */

  async storeData() {
    await this.storage.set('login', this.login); // Stocker des données
  }

  async retrieveData() {
    this.login = await this.storage.get('login'); // Récupérer des données
  }

  async deleteData() {
    await this.storage.remove('login'); // Supprimer des données
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
}
