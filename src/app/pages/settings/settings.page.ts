import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Axie } from 'src/app/models/axie';
import { ActiveProfileService } from 'src/app/services/active-profile.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private sesion: SesionService,
    private fire: FireServiceService,
    private alertController: AlertController,
    private toastController: ToastController,
    private profile: ActiveProfileService
  ) { }

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
}
