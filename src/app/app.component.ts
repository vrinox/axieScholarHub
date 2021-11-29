import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ActiveProfileService } from './services/active-profile.service';
import { AuthService } from './services/auth.service';
import { FireServiceService } from './services/fire-service.service';
import { GetPriceService } from './services/get-price.service';
import { SesionService } from './services/sesion.service';

import { Platform, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  ready:boolean = false;
  appVersion = environment.appVersion;
  slp: any = {};
  axs: any = {};
  eth: any = {};
  constructor(
    private auth: AuthService, 
    private menu: MenuController,
    private sesion: SesionService,
    private router: Router,
    private fire: FireServiceService,
    private getPrice: GetPriceService,
    private activeProfile: ActiveProfileService,
    private platform: Platform,
    private alertController: AlertController,
    private _location: Location
  ) {
    this.initializeApp();
    this.getPriceCrypto(this.slp, 'smooth-love-potion');
    this.getPriceCrypto(this.axs, 'axie-infinity');
    this.getPriceCrypto(this.eth, 'ethereum');
    this.sesion.slp = this.slp;
    setTimeout(async ()=>{
      this.sesion.appStart();
      const isVersionCorrect = await this.verifyAppVersion();
      if(isVersionCorrect) {
        this.sesion.appStart();
      } else {
        this.router.navigateByUrl('/wrong-version',{ replaceUrl: true}); 
      }
    },100)
    this.sesion.sesionInit$.subscribe((init:boolean)=>{
      this.ready = init;
    });
  }
  navigateTo(url){
    this.router.navigate([url]);
    this.menu.close();
  }
  navigateProfile(){
    this.activeProfile.setProfile(this.sesion.battles, this.sesion.user, this.sesion.infinity, this.sesion.axies, true);
    this.activeProfile.navigate();
    this.menu.close();
  }
  logout() {
    this.auth.logout();
    this.menu.close()
  }
  async getPriceCrypto(coin, token){
    let cryto = await this.getPrice.getPrice(token);
    coin.price = parseFloat(cryto[token].usd.toFixed(2));
    coin.image  = await this.getPrice.getImg(token);
  }
  async verifyAppVersion(){
    const app = await this.fire.getApp();
    return app.version === environment.appVersion
  }
  initializeApp() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if (this._location.isCurrentPathEqualTo('/tabs/tabs/tab2')) {
        this.showExitConfirm();
        processNextHandler();
      } else {
        this._location.back();
      }
    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      console.log('Handler called to force close!');
      this.alertController.getTop().then(r => {
        if (r) {
          navigator['app'].exitApp();
        }
      }).catch(e => {
        console.log(e);
      })
    });

  }

  showExitConfirm() {
    this.alertController.create({
      message: 'deseas salir de la APP?',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}
