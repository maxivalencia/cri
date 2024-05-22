import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecapitulationinopinePageRoutingModule } from './recapitulationinopine-routing.module';

import { RecapitulationinopinePage } from './recapitulationinopine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecapitulationinopinePageRoutingModule
  ],
  declarations: [RecapitulationinopinePage]
})
export class RecapitulationinopinePageModule {}
