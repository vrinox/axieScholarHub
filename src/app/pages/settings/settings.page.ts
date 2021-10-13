import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Axie } from 'src/app/models/axie';
import { Scholar } from 'src/app/models/scholar';
import { ActiveProfileService } from 'src/app/services/active-profile.service';
import { ApiTrackerService } from 'src/app/services/api-tracker.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  registerForm: FormGroup;
  loading: HTMLIonLoadingElement;
  submitted: boolean = true;
  constructor(
    private sesion: SesionService,
    private fire: FireServiceService,
    private alertController: AlertController,
    private toastController: ToastController,
    private load: LoadingController,
    private profile: ActiveProfileService,
    private apiTracker: ApiTrackerService,
    private formBuilder: FormBuilder
  ) { 
    const active = this.sesion.infinity;
    this.registerForm = this.formBuilder.group(
      {
        name: [active.name, Validators.required],
        ganancia: [active.ganancia],
      }
    );
  }

  ngOnInit() {
  }
  async select(axie: Axie){
    this.presentAlertConfirm(axie);    
  }
  async presentAlertConfirm(axie: Axie) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Deseas usar este axie como avatar`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Okay',
          handler:async () => {
            await this.fire.updateAvatar(axie, this.sesion.user.uid);
            this.presentToast('Avatar cambiado', 'primary', 'checkmark-outline');
            this.sesion.user.avatar = axie.image;
            this.sesion.user.userAvatar = axie;
            this.profile.active.user = this.sesion.user;
            this.profile.active.axieAvatar = axie;
            this.sesion.setSnapToCache();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentOkToast(){
    await this.presentToast('Avatar cambiado', 'primary', 'checkmark-outline');
  }
  async presentKOToast(){
   await this.presentToast('Error al cambiar avatar', 'danger', 'close-circle-outline');
  }
  async presentToast(text: string, color:string, icon: string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top',
      color: color,
      buttons: [
        {
          side: 'end',
          icon: icon
        }
      ]
    });
    toast.present();
  }
  async enviar(){
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    await this.presentLoading(this.registerForm.value.name);
    let nameExists = await this.apiTracker.nameExists(this.registerForm.value.name);
    if(this.registerForm.value.name !== this.sesion.infinity.name && nameExists){
      this.loading.dismiss();
      this.presentToast(`El nombre ${this.registerForm.value.name} ya esta en uso intente con otro`, 'danger', 'close-circle-outline');
      return;
    }    
    const scholar: Scholar = await this.apiTracker.updateScholar(this.sesion.infinity.roninAddress, {
      name: this.registerForm.value.name,
      ganancia: this.registerForm.value.ganancia
    });
    if (scholar) {
      this.presentToast(`Tus datos han sido actualizado`, 'primary', 'checkmark-outline');
    } else {
      this.presentToast(`Error al modificar tus datos por favor intente mas tarde`, 'danger', 'close-circle-outline');
    }
    this.sesion.infinity.name = scholar.name;
    this.sesion.infinity.ganancia = scholar.ganancia;
    this.sesion.sesionUpdate$.next(this.sesion.infinity);
    this.profile.active.scholar = this.sesion.infinity;
    this.loading.dismiss();
  }
  async presentLoading(name) {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Modificando ' + name
    });
    await this.loading.present();
  }
}
