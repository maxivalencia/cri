import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecapitulationcontrePage } from './recapitulationcontre.page';

const routes: Routes = [
  {
    path: '',
    component: RecapitulationcontrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecapitulationcontrePageRoutingModule {}
