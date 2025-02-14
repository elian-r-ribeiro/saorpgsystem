import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  loggedUserInfoFromLocalStorage = this.authService.getUserLogged();
  loggedUserInfoFromFirebase : any;
  maxHP!: number;
  currentHP!: number;
  allSubscriptions?: Subscription[];
  showVideo: boolean = false;
  isPlaying: boolean = false;
  isPersonIconSelected: boolean = false;
  isPeopleIconSelected: boolean = false;
  isMessageIconSelected: boolean = false;
  isLocationIconSelected: boolean = false;
  isConfigIconSelected: boolean = false;
  isAnyIconSelected: boolean = false;
  isAnyPersonIconMenuOpen: boolean = false;
  isItemsMenuOpen : boolean = false;
  isSkillsMenuOpen: boolean = false;
  isEquipmentMenuOpen: boolean = false;
  selectedItems: any[] = []; 
  selectedSkills: any[] = []; 
  selectedEquips: any[] = []; 
  isSelectionVisible: boolean = false; 
  itemsSelectionVisible: boolean = false;
  skillsSelectionVisible: boolean = false;
  equipsSelectionVisible: boolean = false;
  selectedSquares: Set<string> = new Set();
  HpBarColor: string = 'success';
  indicatorTop: string = '23vh';
  indicatorLeft: string = '990px';
  menuItemsTop: string = '28vh';
  personIcon: string = 'Man.png';
  peopleIcon: string = 'Men.png';
  messageIcon: string = 'Message.png';
  locationIcon: string = 'Location.png';
  configIcon: string = 'Config.png';

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkWatchedStatus();
    this.setLoggedUserInfo();
    this.setHpColor();
  }

  ngOnDestroy() {
    this.unsubscribeFromEverything();
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

  handlePlayerLevelAndXp() {
    if(this.loggedUserInfoFromFirebase[0].playerCurrentXp >= this.loggedUserInfoFromFirebase[0].requiredXpToNextLevel){
      this.firebaseService.updatePlayerLevelAndHp(
        this.loggedUserInfoFromFirebase[0].playerCurrentLevel + 1, 
        this.loggedUserInfoFromFirebase[0].playerMaxHp + 40,
        this.loggedUserInfoFromFirebase[0].id
        );
    }
  }

  async setLoggedUserInfo() {
    const loggedUserUid = this.loggedUserInfoFromLocalStorage.uid;
    const userSubscription = this.firebaseService.getSomethingFromFirebaseWithCondition('uid', loggedUserUid, 'users').subscribe(res => {
      this.loggedUserInfoFromFirebase = res.map(user => {return{id : user.payload.doc.id, ...user.payload.doc.data() as any} as any});
      this.maxHP = this.loggedUserInfoFromFirebase[0].playerMaxHp;
      this.currentHP = this.loggedUserInfoFromFirebase[0].playerCurrentHp;
      this.setHpColor();
    });
    this.allSubscriptions?.push(userSubscription);
  }

  goToProfilePage(){}

  handleIconsActivation(icon: String) {
    if(icon === 'person') {
      this.isPersonIconSelected = !this.isPersonIconSelected;
      this.isPeopleIconSelected = false;
      this.isMessageIconSelected = false;
      this.isLocationIconSelected = false;
      this.isConfigIconSelected = false;
      this.indicatorTop = '27vh';
      this.menuItemsTop = '28vh';
      this.handleIconChange();
      this.closeAllMenusOnIconClose('person', this.isPeopleIconSelected);
      this.handleIndicatorLeft();
    } else if (icon === 'people') {
      this.isPersonIconSelected = false;
      this.isPeopleIconSelected = !this.isPeopleIconSelected;
      this.isMessageIconSelected = false;
      this.isLocationIconSelected = false;
      this.isConfigIconSelected = false;
      this.indicatorTop = '35vh';
      this.menuItemsTop = '36vh';
      this.handleIconChange();
    } else if (icon === 'message') {
      this.isPersonIconSelected = false;
      this.isPeopleIconSelected = false;
      this.isMessageIconSelected = !this.isMessageIconSelected;
      this.isLocationIconSelected = false;
      this.isConfigIconSelected = false;
      this.indicatorTop = '42vh';
      this.menuItemsTop = '43vh';
      this.handleIconChange();
    } else if (icon === 'location') {
      this.isPersonIconSelected = false;
      this.isPeopleIconSelected = false;
      this.isMessageIconSelected = false;
      this.isLocationIconSelected = !this.isLocationIconSelected;
      this.isConfigIconSelected = false;
      this.indicatorTop = '49vh';
      this.menuItemsTop = '50vh';
      this.handleIconChange();
    } else if (icon === 'config') {
      this.isPersonIconSelected = false;
      this.isPeopleIconSelected = false;
      this.isMessageIconSelected = false;
      this.isLocationIconSelected = false;
      this.isConfigIconSelected = !this.isConfigIconSelected;
      this.indicatorTop = '56vh';
      this.menuItemsTop = '57vh';
      this.handleIconChange();
    }

    if(this.isPersonIconSelected == true || this.isPeopleIconSelected == true || this.isMessageIconSelected == true || 
        this.isLocationIconSelected == true || this.isConfigIconSelected == true) {
      this.isAnyIconSelected = true;
    } else {
      this.isAnyIconSelected = false
    }
  }

  closeAllMenusOnIconClose(icon: string, isIconOpening: boolean) {
    if(!isIconOpening){
      this.isAnyPersonIconMenuOpen = false;
      if(icon === 'person') {
        this.isItemsMenuOpen = false;
        this.isSkillsMenuOpen = false;
        this.isEquipmentMenuOpen = false;
      }
    }
  }

  handleMenuOpening(menu: string) {
    if (this.isPersonIconSelected) {
        // Resetando menus antes de abrir o novo
        this.isItemsMenuOpen = false;
        this.isSkillsMenuOpen = false;
        this.isEquipmentMenuOpen = false;
        this.itemsSelectionVisible = false;
        this.skillsSelectionVisible = false;
        this.equipsSelectionVisible = false;

        switch (menu) {
            case 'items':
                this.isItemsMenuOpen = true;
                this.itemsSelectionVisible = true;
                const itemCount = 16;
                this.selectedItems = Array.from({ length: itemCount }, (_, index) => ({ name: `Item ${index + 1}` }));
                break;
            case 'skills':
                this.isSkillsMenuOpen = true;
                this.skillsSelectionVisible = true;
                this.selectedSkills = [
                    { "name": "Skill 1" }, { "name": "Skill 2" }, { "name": "Skill 3" }, { "name": "Skill 4" },
                    { "name": "Skill 5" }, { "name": "Skill 6" }, { "name": "Skill 7" }, { "name": "Skill 8" }
                ];
                break;
            case 'equipment':
                this.isEquipmentMenuOpen = true;
                this.equipsSelectionVisible = true;
                this.selectedEquips = [
                    { "name": "Equip 1" }, { "name": "Equip 2" }, { "name": "Equip 3" }, { "name": "Equip 4" },
                    { "name": "Equip 5" }, { "name": "Equip 6" }, { "name": "Equip 7" }, { "name": "Equip 8" }
                ];
                break;
        }
    }
    this.isAnyPersonIconMenuOpen = this.isItemsMenuOpen || this.isSkillsMenuOpen || this.isEquipmentMenuOpen;
    this.handleIndicatorLeft();
}

  handleIndicatorLeft() {
    if(this.isAnyPersonIconMenuOpen) {
      this.indicatorLeft = '1220px';
    } else {
      this.indicatorLeft = '990px';
    }
  }

  selectItem(item: any) {
    const itemName = item.name;
    if (this.selectedSquares.has(itemName)) {
      this.selectedSquares.delete(itemName);
    } else {
      this.selectedSquares.clear();
      this.selectedSquares.add(itemName);
    }
  }


  handleIconChange() {
    if(this.isPersonIconSelected == true && this.personIcon === 'Man.png') {
      this.personIcon = 'Man_on.png';
    } if (this.isPersonIconSelected == false && this.personIcon === 'Man_on.png') {
      this.personIcon = 'Man.png';
    } if(this.isPeopleIconSelected == true && this.peopleIcon === 'Men.png') {
      this.peopleIcon = 'Men_on.png';
    } if(this.isPeopleIconSelected == false && this.peopleIcon === 'Men_on.png') {
      this.peopleIcon = 'Men.png';
    } if(this.isMessageIconSelected == true && this.messageIcon === 'Message.png') {
      this.messageIcon = 'Message_on.png';
    } if(this.isMessageIconSelected == false && this.messageIcon === 'Message_on.png') {
      this.messageIcon = 'Message.png';
    } if(this.isLocationIconSelected == true && this.locationIcon === 'Location.png') {
      this.locationIcon = 'Location_on.png';
    } if(this.isLocationIconSelected == false && this.locationIcon === 'Location_on.png') {
      this.locationIcon = 'Location.png';
    } if(this.isConfigIconSelected == true && this.configIcon === 'Config.png') {
      this.configIcon = 'Config_on.png';
    } if(this.isConfigIconSelected == false && this.configIcon === 'Config_on.png') {
      this.configIcon = 'Config.png';
    }
  }
  
  unsubscribeFromEverything(){
    this.allSubscriptions?.forEach(subscription => subscription.unsubscribe());
  }
}
