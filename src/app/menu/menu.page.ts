import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  access_level = 10;
  show_menu = "";

  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    if(this.globalData.getIdUser() <= 0 || this.globalData.getUserAccessLevel() > 4){
      this.router.navigate(['/home']);
    }
   }

  ngOnInit() {
    console.log('Initiation page login');
    this.access_level = this.globalData.getUserAccessLevel();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMenu(); // Met à jour le menu à chaque changement de page
    });
  }

  updateMenu(): void {
    this.access_level = this.globalData.getUserAccessLevel();
  }

  estUtilisateur(): boolean {
    return this.access_level <= 4;
  }

  estControleur(): boolean {
    return this.access_level <= 3;
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

  public deconnecterClick(){
    this.globalData.setIdUser(0);
    this.globalData.setIdControle(0);
    this.globalData.setIpAddress("");
    this.globalData.setNombrePhoto(0);
    this.globalData.setListePhoto([]);
    this.globalData.setUserAccessLevel(10);
    this.router.navigate(['/login']);
  }

  ionViewWillEnter(){
    this.access_level = this.globalData.getUserAccessLevel()
    this.show_menu = this.globalData.getShowMenu()?"show":"";
  }

  isLoginRoute() {
    return this.router.url === '/login';
  }
}
