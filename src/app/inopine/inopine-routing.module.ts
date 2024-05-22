import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InopinePage } from './inopine.page';

const routes: Routes = [
  {
    path: '',
    component: InopinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InopinePageRoutingModule {}
