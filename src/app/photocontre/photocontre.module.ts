import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotocontrePageRoutingModule } from './photocontre-routing.module';

import { PhotocontrePage } from './photocontre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotocontrePageRoutingModule
  ],
  declarations: [PhotocontrePage]
})
export class PhotocontrePageModule {}
