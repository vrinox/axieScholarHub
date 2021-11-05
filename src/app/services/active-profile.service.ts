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
  own: boolean = false;
  loading: HTMLIonLoadingElement;
  constructor(
    private apiTrackerService: ApiTrackerService,
    private axieService: lunacianApiService,
    private axieTechService: AxieTechApiService,
    private router: Router,
    private load: LoadingController
  ) { }

  setProfile(sBattles: Battle[], sUser: userLink, sScholar:Scholar, sAxies: Axie[], own: boolean = false) {
    this.active.battles = sBattles;
    this.active.scholar = sScholar;
    this.active.user = sUser;
    this.active.axies = sAxies;
    this.own = own;
  }
  setProfileMin(sUser: userLink, sScholar:Scholar, own: boolean = false){
    this.active.scholar = sScholar;
    this.active.user = sUser;
    this.own = own;
  }
  async getProfile(roninAddress: string){
    let user;
    let scholar;
    let battles;
    let axies;
    this.presentLoading();
    const searchScholar: Scholar = new Scholar();
    searchScholar.roninAddress = roninAddress;
    console.log(searchScholar);
    [user, scholar, battles, axies] = await Promise.all([
      this.apiTrackerService.getUserLink('roninAddress', roninAddress),
      this.apiTrackerService.getScholar('roninAddress', roninAddress),
      this.axieTechService.getBattleLog(roninAddress),
      this.axieService.getAxies(searchScholar),
    ]);
    user.userAvatar = this.getAxieAvatar(user);
    this.setProfile(battles, user, scholar, axies);
    this.load.dismiss();
  }
  async getProfileMin(roninAddress: string){
    this.clean();
    this.active
    let user;
    let scholar;
    this.presentLoading();
    [user, scholar] = await Promise.all([
      this.apiTrackerService.getUserLink('roninAddress', roninAddress),
      this.apiTrackerService.getScholar('roninAddress', roninAddress),
    ]);
    if(user === null){
      user = {
        userAvatar: new Axie()
      }
    }else{
      user.userAvatar = this.getAxieAvatar(user);
    }
    console.log('min',user);
    this.setProfileMin(user, scholar);
    this.load.dismiss();
  }
  navigate(){
    this.router.navigate(['profile']);
  }
  clean(){
    this.active.battles = [];
    this.active.axies = [];
    this.active.scholar = new Scholar();
    this.active.user = {
      roninAddress: '',
      avatar: '',
      uid: '',
      userAvatar: new Axie()
    };
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Buscando datos de profile...'
    });
    await this.loading.present();
  }
  public getAxieAvatar(rawUserData: userLink){
    return new Axie({
      id: rawUserData.avatar.split('/')[5]
    });
  }
}
