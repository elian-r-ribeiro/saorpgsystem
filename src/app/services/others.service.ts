import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OthersService {

  constructor() { }

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
}
