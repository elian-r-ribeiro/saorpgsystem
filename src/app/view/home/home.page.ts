import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  showVideo: boolean = false;
  isPlaying: boolean = false;
  loggedUserInfoFromLocalStorage = this.authService.getUserLogged();
  loggedUserInfoFromFirebase : any;
  maxHP: number = 500;
  currentHP: number = 500;
  HpBarColor = 'success';

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkWatchedStatus();
    this.setLoggedUserInfo();
    this.setHpColor()
  }

  calculateHpPercentage(): number {
    return (this.currentHP / this.maxHP) * 100;
  }

  setHpColor() {
    const percentage = this.calculateHpPercentage();
    console.log(percentage);
  
    if (percentage <= 100 && percentage > 50) {
      this.HpBarColor = 'success';
    } else if (percentage <= 50 && percentage >= 20) {
      this.HpBarColor = 'warning';
    } else if (percentage > 20) {
      this.HpBarColor = 'danger';
    } else {
      this.HpBarColor = 'danger';
    }
  }

  // Função de teste enquanto não implemento o firebase
  decreaseValue() {
    if (this.currentHP > 0) {
      this.currentHP -= 50; 
    }
    this.setHpColor();
  }

  async checkWatchedStatus() {
    try {
      const watched = await this.firebaseService.getWatchedStatus();
      this.showVideo = !watched;
    } catch (error) {
      console.error('Erro ao verificar o status:', error);
      this.showVideo = false;
    }
  }

  ngAfterViewInit() {
    if (this.showVideo) {
      setTimeout(() => {
        this.tryPlayVideo();
      }, 1000);
    }
  }

  tryPlayVideo() {
    const videoElement = this.videoPlayer?.nativeElement;
    if (videoElement) {
      if (!this.isPlaying) { 
        videoElement.load();
        videoElement.currentTime = 0;
        videoElement.play().then(() => {
          this.isPlaying = true; 
        }
      )
      }else{
        videoElement.pause(); 
        this.isPlaying = false; 
      }
    }
  }

  onUserInteraction() {
    if (!this.isPlaying) { 
      this.tryPlayVideo();
    }
  }

  async onVideoEnded() {
    this.showVideo = false;
    this.isPlaying = false; 
    try {
      await this.firebaseService.updateWatchedStatus();
      location.reload();
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  }

  async setLoggedUserInfo() {
    const loggedUserUid = this.loggedUserInfoFromLocalStorage.uid;
    this.firebaseService.getSomethingFromFirebaseWithCondition('uid', loggedUserUid, 'users').subscribe(res => {
      this.loggedUserInfoFromFirebase = res.map(user => {return{id : user.payload.doc.id, ...user.payload.doc.data() as any} as any});
      this.maxHP = this.loggedUserInfoFromFirebase[0].playerMaxHp;
      this.currentHP = this.loggedUserInfoFromFirebase[0].playerCurrentHp;
      this.setHpColor();
    });
  }

  goToProfilePage(){}
}
