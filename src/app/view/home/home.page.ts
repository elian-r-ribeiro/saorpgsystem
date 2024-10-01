import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
}
