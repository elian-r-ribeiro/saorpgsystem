import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertService } from './alert.service';
import { OthersService } from './others.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth, 
    private firestore: AngularFirestore, 
    private alertService: AlertService,
    private othersService: OthersService,
    private firebaseService: FirebaseService) { }

  async registerUser(userName: string, email: string, password: string, image: any): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert('Criando conta...');

    if (!this.othersService.checkIfFileTypeIsCorrect(image)) {
      loading.dismiss();
    } else {
      const userData = await this.auth.createUserWithEmailAndPassword(email, password).then(async (userData) => {
        const uid = userData.user?.uid;
        const imageURL = await this.firebaseService.getImageDownloadURL(image, 'profilePictures', uid);
        await this.firestore.collection('users').add({ userName, email, imageURL, uid});
        //this.userLogin(email, password);
        loading.dismiss();
      }).catch(error => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'O email informado já está em uso';
            break;
          default:
            errorMessage = 'Erro ao efetuar registro, por favor, tente novamente mais tarde';
            break;
        }
        this.alertService.presentAlert('Erro de Login', errorMessage);;
        loading.dismiss();
      })
    }
  }
  
  login(){}
}
