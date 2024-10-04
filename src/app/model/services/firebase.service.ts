import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  user: any;

  constructor(
    private storage: AngularFireStorage, 
    private firestore: AngularFirestore, 
    private auth: AngularFireAuth, 
    @Inject(Injector) private readonly injector: Injector,
    ) { }

  private injectAuthService(){
    return this.injector.get(AuthService);
  }
  
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

  updatePlayerLevel(newLevel: number, userDocumentId: string) {
    return this.firestore.collection('users').doc(userDocumentId).update({ playerCurrentLevel: newLevel, playerCurrentXp: 0});
  }

  getSomethingFromFirebase(path: string) {
    return this.firestore.collection(path).snapshotChanges();
  }

  getSomethingFromFirebaseWithCondition(condition: string, equalsTo: string, path: string): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection(path, ref => ref.where(condition, '==', equalsTo)).snapshotChanges();
  }

  async getWatchedStatus(): Promise<boolean> {
    this.user = this.injectAuthService().getUserLogged();
    const snapshot = await this.firestore.collection('users', ref => ref.where('uid', '==', this.user.uid)).get().toPromise();
    if (snapshot && snapshot.docs.length > 0) {
      const userData = snapshot.docs[0].data() as { watched?: boolean };
      return userData.watched ?? false; 
    }
    return false; 
  }

  async updateWatchedStatus(): Promise<void> {
    this.user = this.injectAuthService().getUserLogged();
    const snapshot = await this.firestore.collection('users', ref => ref.where('uid', '==', this.user.uid)).get().toPromise();
    if (snapshot && snapshot.docs.length > 0) {
      const docId = snapshot.docs[0].id;
      await this.firestore.collection('users').doc(docId).update({ watched: true });
    }
  }
}
