import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OthersService } from 'src/app/services/others.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  fileSelectLabelText = "Selecionar imagem de perfil";
  isFileSelected = false;
  image: any;

  constructor(private builder: FormBuilder, private othersService: OthersService) { }

  ngOnInit() {
    this.startForm();
  }

  startForm(): void {
    this.registerForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      profileImage: [null, [this.validateImage]]
    });
  }

  validateImage(control: FormControl): { [s: string]: boolean } | null {
    if (!control.value) {
      return { 'required': true };
    }
    return null;
  }

  showConfirmAccountRegister(){}

  goToLoginPage(){}

  uploadFile(image: any): void {
    this.image = image.files;
  }

  changeFileInputLabelOnFileSelect(value: string): void {
    this.isFileSelected = this.othersService.changeFileInputStateOnFileSelect(value);
    this.fileSelectLabelText = this.othersService.changeFileInputLabelOnFileSelect(value, "Foto de perfil selecionada", "Selecione a foto de perfil");
  }
}