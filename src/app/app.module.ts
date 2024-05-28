import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { GlobalData } from './global_data';
import { MenuPage } from './menu/menu.page';
import { FooterPage } from './footer/footer.page';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
//import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@NgModule({
  declarations: [AppComponent, MenuPage, FooterPage],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(),],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, GlobalData],
  bootstrap: [AppComponent],
})
export class AppModule {}
