import { Injectable, Directive } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class GlobalData {
  private id_user: number = 0;
  private id_controle: number = 0;
  private ip_address: string = "";

  private nombre_photo: number = 0;
  private liste_photo: any;

  private type_operation : string = "";
  private visite: any;
  private reception: any;
  private constatation: any;

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

  setNombrePhoto(nombre_photo:number) {
    this.nombre_photo = nombre_photo;
  }

  getNombrePhoto():number{
      return this.nombre_photo;
  }

  setListePhoto(liste_photo:any) {
    this.liste_photo = liste_photo;
  }

  getListePhoto():any{
      return this.liste_photo;
  }

  setVisite(visite:any) {
    this.visite = visite;
  }

  getVisite():any{
      return this.visite;
  }

  setReception(reception:any) {
    this.reception = reception;
  }

  getReception():any{
      return this.reception;
  }

  setConstatation(constatation:any) {
    this.constatation = constatation;
  }

  getConstatation():any{
      return this.constatation;
  }

  setTypeOperation(type_operation:string) {
    this.type_operation = type_operation;
  }

  getTypeOperation():string{
      return this.type_operation;
  }
}
