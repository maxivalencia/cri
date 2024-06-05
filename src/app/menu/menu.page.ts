import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  access_level = 10;

  constructor(public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) { }

  ngOnInit() {
    console.log('Initiation page login');
    this.access_level = this.globalData.getUserAccessLevel();
  }

  estUtilisateur(): boolean {
    return this.access_level <= 4;
  }

  estControleur(): boolean {
    return this.access_level <= 3;
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
