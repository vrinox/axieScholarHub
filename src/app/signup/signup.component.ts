import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchingValidatior } from '../validators/email.validator';
import { Scholar } from '../models/scholar';
import { AxieApiService } from '../services/axie-api.service';
import { scholarOfficialData } from '../models/interfaces';
import { Axie } from '../models/axie';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = true;
  scholar: Scholar;
  axies: Axie[] = [];
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private axieService: AxieApiService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        avatar: ['', Validators.required],
        roninAddress: ['', Validators.required],
        fullname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required ],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {validators: passwordMatchingValidatior}
    );
    
  }

  enviar(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.emailSignup({
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      roninAddress: this.registerForm.value.roninAddress,
      avatar: this.registerForm.value.avatar
    })
  }
  buscarDireccion() {
    this.axieService.getAccountData(this.registerForm.value.roninAddress)
      .then((accountData:scholarOfficialData)=>{
        let account = new Scholar();
        account.parse(accountData);
        this.scholar = account;
      });
    this.axieService.getAxies(this.registerForm.value.roninAddress)
      .then((data:Axie[])=>{
        this.axies = data;
      });
  }
  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
  seleccionar(axie:Axie){
    this.registerForm.controls.avatar.setValue(axie.image);
    this.axies.forEach((axie:Axie)=>{
      axie.cssContainerClass = "";
    });
    axie.cssContainerClass="selected"; 
  }
}
