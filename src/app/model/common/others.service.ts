import { Injectable } from '@angular/core';
import { AlertService } from '../common/alert.service';

@Injectable({
  providedIn: 'root'
})
export class OthersService {

  constructor(private alertService: AlertService) { }

  changeFileInputStateOnFileSelect(value: string): boolean {
    if(value){
      return true;
    } else {
      return false;
    }
  }

  changeFileInputLabelOnFileSelect(value: string, textSelected: string, textNotSelected: string): string {
    if(value){
      return textSelected;
    } else {
      return textNotSelected;
    }
  }

  checkIfFileTypeIsCorrect(image: any): boolean {
    const file = image.item(0);
    if (file.type.split('/')[0] !== 'image') {
      this.alertService.presentAlert('Erro ao enviar foto de perfil', 'Tipo não suportado');
      return false;
    } else {
      return true;
    }
  }
}
