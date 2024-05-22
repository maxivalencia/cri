import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContrePageRoutingModule } from './contre-routing.module';

import { ContrePage } from './contre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContrePageRoutingModule
  ],
  declarations: [ContrePage]
})
export class ContrePageModule {}
