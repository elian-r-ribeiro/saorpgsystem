import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertService } from '../common/alert.service';
import { FirebaseService } from './firebase.service';
import { OthersService } from '../common/others.service';
import { RoutingService } from '../common/routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userInfo: any;

  constructor(
    private auth: AngularFireAuth, 
    private firestore: AngularFirestore, 
    private alertService: AlertService,
    private othersService: OthersService,
    private firebaseService: FirebaseService,
    private routingService: RoutingService) { }

  async registerAccount(userName: string, email: string, password: string, image: any, watched: boolean): Promise<void> {
    const loading = await this.alertService.presentLoadingAlert('Criando conta...');

    if (!this.othersService.checkIfFileTypeIsCorrect(image)) {
      loading.dismiss();
    } else {
      const userData = await this.auth.createUserWithEmailAndPassword(email, password).then(async (userData) => {
        const uid = userData.user?.uid;
        const imageURL = await this.firebaseService.getImageDownloadURL(image, 'profilePictures', uid);
        await this.firestore.collection('users').add({ 
          userName, email, imageURL, uid, watched, playerMaxHp: 500, playerCurrentHp: 500,
          playerCurrentLevel: 1, playerCurrentXp: 0, requiredXpToNextLevel: 100 });
        await userData.user?.sendEmailVerification();
        loading.dismiss();
        this.alertService.presentAlert('Sucesso', 'Um e-mail de confirmação foi enviado para você, verifique antes de fazer login');
        this.routingService.goToLoginPage();
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
  
  async login(email: string, password: string){
    const loading = await this.alertService.presentLoadingAlert('Logando...');
    this.auth.signInWithEmailAndPassword(email, password)
      .then(async (loggedUserInfo) => {
        this.userInfo = loggedUserInfo;
        if(!loggedUserInfo.user?.emailVerified) {
          loading.dismiss();
          this.alertService.presentConfirmAlert('Erro', 'Você precisa verificar seu e-mail antes de logar, clique em "Confirmar" para reenviar a confirmação',
            this.sendEmailValidation.bind(this)
          );
        } else {
          loading.dismiss();
          await this.setItemsOnLocalStorage();
          this.alertService.presentAlert('Login realizado com sucesso', 'Você será redirecionado para a Home');
          this.routingService.goToHomePage();
        }
      })
      .catch(error => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Usuário não encontrado, verifique seu email e sua senha e tente novamente';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Você fez muitas solicitações em pouco tempo, tente novamente mais tarde'
            break;
          default:
            errorMessage = 'Erro ao efetuar login, por favor, tente novamente mais tarde';
            break;
        }
        this.alertService.presentAlert('Erro de Login', errorMessage);
      });
  }

  sendEmailValidation(): void {
    this.userInfo.user?.sendEmailVerification();
    this.alertService.presentAlert('Sucesso', 'E-mail de confirmação enviado com sucesso');
  }

  async setItemsOnLocalStorage(): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  public getUserLogged(){
    const user : any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
  }
}
