import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchingValidatior } from '../../validators/email.validator';

import { Scholar } from '../../models/scholar';
import { Axie } from '../../models/axie';
import { scholarOfficialData, userLink } from '../../models/interfaces';

import { lunacianApiService } from '../../services/lunacian-api.service';
import { ApiTrackerService } from '../../services/api-tracker.service';
import { AuthService } from '../../services/auth.service';
import { AxieTechApiService } from '../../services/axie-tech-api.service';
import { AlertController, LoadingController } from '@ionic/angular';

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
  loading: HTMLIonLoadingElement;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private axieService: lunacianApiService,
    private trackerService: ApiTrackerService,
    private axieTechService: AxieTechApiService,
    private alertController: AlertController,
    private load: LoadingController
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
      roninAddress: this.axieTechService.parseRonin(this.registerForm.value.roninAddress),
      avatar: this.registerForm.value.avatar
    }).then(async (userLinkData: userLink)=>{
      const uid: string = await this.trackerService.addUserLink(userLinkData);
      const trackingData = await this.trackerService.getScholar('roninAddress', userLinkData.roninAddress);
      if(!trackingData) {
        await this.registerTrackerData(userLinkData.roninAddress, this.registerForm.value.fullname);
      }
      this.authService.loginComplete(uid);
    })
  }
  async registerTrackerData(roninAddress: string, fullname: string){
    const officialData: scholarOfficialData = await this.axieTechService.getAllAccountData(roninAddress);
    const scholar: Scholar = new Scholar();
    scholar.parse(officialData);
    scholar.name = fullname;
    scholar.roninAddress = roninAddress;
    const docId = await this.trackerService.addScholar(scholar);
    console.log('usuario registrado con id = ',docId);
  }
  buscarDireccion() {
    if(this.registerForm.value.roninAddress !== ''){      
    this.presentLoading();
    this.axieService.getAccountData(this.registerForm.value.roninAddress)
      .then((accountData:scholarOfficialData)=>{
        let account = new Scholar();
        account.parse(accountData);
        this.scholar = account;
      });
    this.axieService.getAxies(this.registerForm.value.roninAddress)
      .then((data:Axie[])=>{
        if(data && data.length !== 0) {
          this.axies = data;
        } else {
          this.presentAlert();
        }
      });
    }
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
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Warning',
      subHeader: '',
      message: 'Si tu cuenta no tiene axies no puedes continuar con el proceso',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Buscando los datos de tu cuenta y tus axies ...'
    });
    await this.loading.present();
  }
}
