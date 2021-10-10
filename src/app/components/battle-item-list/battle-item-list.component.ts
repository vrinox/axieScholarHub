import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Battle } from 'src/app/models/battle';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { lunacianApiService } from 'src/app/services/lunacian-api.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-battle-item-list',
  templateUrl: './battle-item-list.component.html',
  styleUrls: ['./battle-item-list.component.scss'],
})
export class BattleItemListComponent implements OnInit {
  @Input() battle: Battle = new Battle();
  @Input() type: string = "own";
  loading: HTMLIonLoadingElement
  constructor(
    private fire: FireServiceService,
    private load: LoadingController,
    private lunacian: lunacianApiService,
    private sesion: SesionService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    
  }

  async share(){
    await this.presentAlertPrompt();    
  }
  async saveShareBattle(text: string){
    await this.presentLoading();
    await this.fire.shareReplay(this.battle, {
      scholar: this.sesion.infinity.getValuesMin(),
      axie: this.sesion.getAxieAvatar(this.sesion.user).getValuesMin(),
      text: text || ''
    });
    const toast = await this.toastController.create({
      message: 'Battle shared',
      duration: 2000,
      position: 'top',
      color: "primary",
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-outline'
        }
      ]
    });
    toast.present();
    this.loading.dismiss();
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Sharing your Conquer please wait ...'
    });
    await this.loading.present();
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deseas Compartir esta Batalla!',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'textarea',
          placeholder: 'Algun comentario sobre esta hazaña que quieras compartir'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.saveShareBattle(data.text);
          }
        }
      ]
    });

    await alert.present();
  }
}
