import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchingValidatior } from '../validators/email.validator';

import { Scholar } from '../models/scholar';
import { Axie } from '../models/axie';
import { scholarOfficialData, userCloudData, userLink } from '../models/interfaces';

import { lunacianApiService } from '../services/lunacian-api.service';
import { ApiTrackerService } from '../services/api-tracker.service';
import { AuthService } from '../services/auth.service';

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
    private axieService: lunacianApiService,
    private trackerService: ApiTrackerService
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
    }).then(async (userLinkData: userLink)=>{
      const uid: string = await this.trackerService.addUserLink(userLinkData);      
      this.authService.loginComplete(uid);
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
