import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { ref, onMounted, watch } from 'vue';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(public photoService: PhotoService) { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
