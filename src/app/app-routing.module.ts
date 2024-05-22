import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'photo',
    loadChildren: () => import('./photo/photo.module').then( m => m.PhotoPageModule)
  },
  {
    path: 'consultation',
    loadChildren: () => import('./consultation/consultation.module').then( m => m.ConsultationPageModule)
  },
  {
    path: 'contre',
    loadChildren: () => import('./contre/contre.module').then( m => m.ContrePageModule)
  },
  {
    path: 'inopine',
    loadChildren: () => import('./inopine/inopine.module').then( m => m.InopinePageModule)
  },
  {
    path: 'apropos',
    loadChildren: () => import('./apropos/apropos.module').then( m => m.AproposPageModule)
  },
  {
    path: 'qrcode',
    loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule)
  },
  {
    path: 'recapitulationinopine',
    loadChildren: () => import('./recapitulationinopine/recapitulationinopine.module').then( m => m.RecapitulationinopinePageModule)
  },
  {
    path: 'recapitulationcontre',
    loadChildren: () => import('./recapitulationcontre/recapitulationcontre.module').then( m => m.RecapitulationcontrePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
