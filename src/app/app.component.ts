import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { FireServiceService } from './services/fire-service.service';
import { GetPriceService } from './services/get-price.service';
import { SesionService } from './services/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  ready:boolean = false;
  slp: any = {};
  axs: any = {};
  eth: any = {};
  constructor(
    private auth: AuthService, 
    private menu: MenuController,
    private sesion: SesionService,
    private router: Router,
    private fire: FireServiceService,
    private getPrice: GetPriceService
  ) {
    this.getPriceCrypto(this.slp, 'smooth-love-potion');
    this.getPriceCrypto(this.axs, 'axie-infinity');
    this.getPriceCrypto(this.eth, 'ethereum');
    this.sesion.slp = this.slp;
    setTimeout(async ()=>{
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
}
