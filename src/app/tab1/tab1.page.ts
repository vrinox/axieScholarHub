import { Component, OnInit } from '@angular/core';
import { AlertInput } from '@ionic/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { community } from '../models/interfaces';
import { ComunityService } from '../services/community.service';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  community: any = null;
  feedPlaceHolder: string = "Aqui van los mensajes de la comunidad";
  admin: boolean = false;
  alert: HTMLIonAlertElement;
  loading: HTMLIonLoadingElement;
  constructor(
    private sesion: SesionService,
    private communityService: ComunityService,
    private router: Router,
    private toastController: ToastController,
    private load: LoadingController,
    private alertController: AlertController
  ) {
    this.communityService.activeUpdate$.subscribe((communityUpdated: community) => {
      if (communityUpdated) {
        this.community = communityUpdated;
      }
    });
  }
  async ngOnInit() {
    this.community = (this.sesion.communities && this.sesion.communities.length !== 0) ? this.sesion.communities[0] : null;
    if (this.community) {
      await this.buildCommunity(this.community)
    }
  }
  async buildCommunity(community: community) {
    this.community.feed = [];
    this.community.solicitudes = [];
    const communityComplement = await this.communityService.buildCommunity(community);
    Object.assign(this.community, communityComplement);
    this.admin = (this.community.admin === this.sesion.infinity.roninAddress);
    this.communityService.activeCommunity = this.community;
  }
  navigate(destiny: string) {
    if (destiny === 'join') {
      this.router.navigate(['join-community']);
    } else if (destiny === 'create') {
      this.router.navigate(['create-community']);
    } else if (destiny === 'rank') {
      this.router.navigate(['rank']);
    } else if (destiny === 'feed') {
      this.router.navigate(['community-feed']);
    }
  }

  async presentToast(text: string, color: string, icon: string) {
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
  navigateToSettings() {
    this.router.navigate(['community-settings']);
  }
  async presentAlertRadio() {
    const inputs: AlertInput[] = this.sesion.communities.map((community: community) => {
      return {
        name: community.name,
        type: 'radio',
        label: community.name,
        handler: async () => {
          this.presentLoading();
          this.alert.dismiss();
          this.communityService.activeCommunity = await this.communityService.buildCommunity(community);
          this.community = this.communityService.activeCommunity;
          this.admin = (this.community.admin === this.sesion.infinity.roninAddress);
          this.loading.dismiss();
        }
      }
    });
    this.alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Elige comunidad',
      inputs: [...inputs,
      {
        name: 'new community',
        type: 'radio',
        label: 'Buscar nueva',
        handler: async () => {
          this.navigate('join');
          this.alert.dismiss();
        }
      }]
    });

    await this.alert.present();
  }

  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Cambiando de comunidad'
    });
    await this.loading.present();
  }
}
