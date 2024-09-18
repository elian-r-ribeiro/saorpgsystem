import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private storage: AngularFireStorage) { }

  async getImageDownloadURL(image: any, path: string, uidOrId?: string): Promise<string> {
    var imageURL: string = '';
    const uploadTask = this.uploadImage(image, path, uidOrId);
    await uploadTask?.then(async snapshot => {
      imageURL = await snapshot.ref.getDownloadURL();
    })
    return imageURL;
  }

  uploadImage(image: any, PATH: string, fileName: any): AngularFireUploadTask {
    const file = image.item(0);
    const path = `${PATH}/${fileName}`;
    let task = this.storage.upload(path, file);
    return task;
  }
}
