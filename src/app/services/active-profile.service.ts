import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Axie } from '../models/axie';
import { Battle } from '../models/battle';
import { profile, userLink } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from './api-tracker.service';
import { AxieTechApiService } from './axie-tech-api.service';
import { lunacianApiService } from './lunacian-api.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveProfileService {
  active: profile = {
    battles: [],
    scholar: new Scholar(),
    axies: []
  }
  loading: HTMLIonLoadingElement;
  constructor(
    private apiTrackerService: ApiTrackerService,
    private axieService: lunacianApiService,
    private router: Router,
    private load: LoadingController
  ) { }

  setProfile(sBattles: Battle[], sUser: userLink, sScholar:Scholar, sAxies: Axie[]) {
    this.active.battles = sBattles;
    this.active.scholar = sScholar;
    this.active.user = sUser;
    this.active.axies = sAxies;
  }
  async getProfile(roninAddress: string){
    let user;
    let scholar;
    let battles;
    let axies;
    this.presentLoading();
    [user, scholar, battles, axies] = await Promise.all([
      this.apiTrackerService.getUserLink('roninAddress', roninAddress),
      this.apiTrackerService.getScholar('roninAddress', roninAddress),
      this.axieService.getBattles(roninAddress),
      this.axieService.getAxies(roninAddress),
    ]);
    user.userAvatar = this.getAxieAvatar(user);
    this.setProfile(battles, user, scholar, axies);
    this.load.dismiss();
  }
  navigate(){
    this.router.navigate(['profile']);
  }
  clean(){
    this.active.battles = [];
    this.active.scholar = new Scholar();
    this.active.user = null;
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Buscando datos ...'
    });
    await this.loading.present();
  }
  public getAxieAvatar(rawUserData: userLink){
    return new Axie({
      id: rawUserData.avatar.split('/')[5]
    });
  }
}
