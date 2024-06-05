import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotocontrePage } from './photocontre.page';

const routes: Routes = [
  {
    path: '',
    component: PhotocontrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotocontrePageRoutingModule {}
