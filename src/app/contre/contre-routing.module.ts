import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContrePage } from './contre.page';

const routes: Routes = [
  {
    path: '',
    component: ContrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContrePageRoutingModule {}
