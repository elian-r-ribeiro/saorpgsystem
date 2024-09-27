import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  showVideo: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.checkWatchedStatus();
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

  async onVideoEnded() {
    this.showVideo = false;
    try {
      await this.firebaseService.updateWatchedStatus(); 
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  }
}
