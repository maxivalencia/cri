import { Component, OnInit, Injectable, Directive, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import{ GlobalData } from '../global_data';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { App } from '@capacitor/app';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnDestroy {
  scannedResult : any;
  bodyElement : HTMLElement | null;

  constructor(
    public http: HttpClient,
    private router: Router,
    public globalData: GlobalData,
    private storage: Storage
  ) {
    /* if(this.globalData.getIdUser() == 0){
      this.router.navigate(['/login']);
    } */
    /* this.prepare(); */
    this.bodyElement = document.querySelector('body');
  }

  prepare = () => {
    BarcodeScanner.prepare();
  };

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
      // the user granted permission
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
      return false;
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      this.prepare();
      await BarcodeScanner.hideBackground();
      this.bodyElement?.classList.add('scanner-active');
      const result = await BarcodeScanner.startScan();
      console.log(result);
      if(result?.hasContent) {
        this.scannedResult = result.content;
        BarcodeScanner.showBackground();
        this.bodyElement?.classList.remove('scanner-active');
        console.log(this.scannedResult);
      }
      else {
        console.log("Aucun contenu trouvé");
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.bodyElement?.classList.remove('scanner-active');
  }

  ngOnDestroy(): void {
      this.stopScan();
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
