import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm! : FormGroup;

  constructor(private builder: FormBuilder, private routingService: RoutingService) { }

  ngOnInit() {
    this.startForm();
  }

  submitForm(){}

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
