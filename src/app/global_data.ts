import { Injectable, Directive } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class GlobalData {
  private id_user: number = 0;
  private id_controle: number = 0;
  private ip_address: string = "";

  setIdUser(id_user:number) {
    this.id_user = id_user;
  }

  getIdUser():number{

      return this.id_user;
  }

  setIdControle(id_controle:number) {
    this.id_controle = id_controle;
  }

  getIdControle():number{

      return this.id_controle;
  }

  setIpAddress(ip_address:string) {
    this.ip_address = ip_address;
  }

  getIpAddress():string{

      return this.ip_address;
  }
}
