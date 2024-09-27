import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/model/common/routing.service';
import { AuthService } from 'src/app/model/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm! : FormGroup;

  constructor(
    private builder: FormBuilder, 
    private routingService: RoutingService,
    private authService: AuthService) { }

  ngOnInit() {
    this.startForm();
  }

  login(){
    if(this.loginForm.valid) {
      this.authService.login(this.loginForm.value['email'], this.loginForm.value['password']);
    }
  }

  startForm(): void {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  goToPasswordResetPage(){}
  
  goToRegisterPage(){
    this.routingService.goToRegisterPage();
  }
}
