import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username : string = "";
  password : string = "";
  message_connection : string = "";
  adresse : string = "";
  auth : any;
  code : any;
  id_user : any;

  constructor(public http: HttpClient, private router: Router) { }

  ngOnInit() {
    console.log('Initiation page login');
  }

  signIn() {
    console.log("En attente du service d'authentification ...!")
    //var _this = this;
    this.getAddress().subscribe((adresse : any) => {
      this.adresse = adresse.trim();
      this.getAuthentification().subscribe(auth => {
        console.log(auth);
        this.auth = auth;
        this.message_connection = auth["message"];
        if(auth["code"] == 200){
          this.id_user = auth["id_user"];
          this.router.navigate(['/home']);
          GlobalData.id_user = this.id_user;
        }
        this.password = "";
      });
    })
  }

  public getAddress(): Observable<any> {
    return this.http.get("assets/data/adresse.txt", {responseType: 'text'});
  }

  public getAuthentification(): Observable<any> {
    // return this.http.get("./assets/data/anomalies.json");
    return this.http.get(this.adresse + "/cri/login/service?username=" + this.username + "&password=" + this.password);
  }
}
