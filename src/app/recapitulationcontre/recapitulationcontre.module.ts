import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecapitulationcontrePageRoutingModule } from './recapitulationcontre-routing.module';

import { RecapitulationcontrePage } from './recapitulationcontre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecapitulationcontrePageRoutingModule
  ],
  declarations: [RecapitulationcontrePage]
})
export class RecapitulationcontrePageModule {}
