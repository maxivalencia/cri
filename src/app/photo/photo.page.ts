import { Component, OnInit, Injectable, Directive } from '@angular/core';
import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { PhotoService } from '../services/photo.service';
import{ GlobalData } from '../global_data';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
@Injectable()
export class PhotoPage {

  imageSource : any;

  constructor(public globalData: GlobalData, private router: Router) {
    /* if(this.globalData.getIdUser() == 0){
      this.router.navigate(['/login']);
    } */
  }

  /* ngOnInit() {
  } */

  /* takePicture = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false,
    });
  }; */

  takePicture = async () => {
    const image = await Camera.getPhoto({
      resultType : CameraResultType.Base64,
      source : CameraSource.Photos,
      quality : 100,
      allowEditing : false,
      saveToGallery : false,
    });

    this.imageSource = 'data:image/jpeg;base64' + image.base64String;

    console.log(this.imageSource)
  };

}
