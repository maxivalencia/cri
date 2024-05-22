import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InopinePageRoutingModule } from './inopine-routing.module';

import { InopinePage } from './inopine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InopinePageRoutingModule
  ],
  declarations: [InopinePage]
})
export class InopinePageModule {}
