import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecapitulationinopinePage } from './recapitulationinopine.page';

const routes: Routes = [
  {
    path: '',
    component: RecapitulationinopinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecapitulationinopinePageRoutingModule {}
