import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Axie } from '../models/axie';
import { Battle } from '../models/battle';
import { scholarOfficialData, userCloudData, userLink } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from './api-tracker.service';
import { lunacianApiService } from './lunacian-api.service';
import { StorageService } from './storage.service';
import { AxieTechApiService } from './axie-tech-api.service';

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  infinity: Scholar;
  axies: Axie[];
  user: userLink;
  battles: Battle[];
  sesionInit$: Subject<boolean> = new Subject();
  public loading: HTMLIonLoadingElement;

  constructor(
    private storage: StorageService,
    private router: Router,
    private axieService: lunacianApiService,
    private load: LoadingController,
    private trackerService: ApiTrackerService,
    private axieTechService: AxieTechApiService
  ) { }

  public async sesionInit(uid:string, type: string) {
    this.sesionInit$.next(false);
    await this.presentLoading();
    let rawUser: userCloudData;
    if(type == "login") {
      rawUser = await this.trackerService.getUserData(uid);
    } else {
      rawUser = await this.storage.getUser();
    }
    this.storage.setUser(rawUser);
    this.axies = await this.getAxies();
    this.battles = await this.storage.getBattles();
    this.infinity = new Scholar(rawUser.scholar);
    this.user = rawUser.userData;
    this.getAxieAvatar(rawUser.userData);
    this.sesionInit$.next(true);
    this.router.navigateByUrl('/tabs');    
    this.loading.dismiss();
    
    this.getUpdatedDatafromApi(this.infinity.roninAddress);
  }

  public async appStart(){    
    const user: userCloudData = await this.storage.getUser();
    if(user) {
      this.sesionInit(user.userData.uid, "start");
    } else {
      this.router.navigate(['/email-login']);
    }
  }

  public close(){
    this.sesionInit$.next(false);
    this.storage.clear();
    this.infinity = null;
    this.axies= [];
    this.user = null;
    this.router.navigate(['/email-login']);
  }

  public getUpdatedDatafromApi(roninAddress: string){
    this.axieService.getAxies(roninAddress).then((axies:Axie[])=>{
      this.axies = axies;
      this.axieTechService.getAxiesAllData(this.axies);
      this.storage.setAxies(axies.map((axie: Axie)=>{
        return axie.getValues();
      }));
    });
    this.axieTechService.getAllAccountData(roninAddress).then((updatedData:scholarOfficialData)=>{
      const updatedScholar = new Scholar();
      updatedScholar.parse(updatedData);
      this.infinity.update(updatedScholar);
    });
    this.axieService.getBattles(this.infinity.roninAddress).then((battles)=>{
      this.battles = battles.map((rawBattle)=>{
        return new Battle(rawBattle);
      });
      this.storage.setBattles(battles);
    });
  }
  async getAxies(){
    let axies:Axie[] = await this.storage.getAxies();
    if(axies){
      const updatedAxies = axies.map((axie:Axie)=>{
        const newAxie = new Axie(axie);
        return newAxie;
      })
      this.axieTechService.getAxiesAllData(updatedAxies);
      return updatedAxies;
    } else {
      return [];
    }
  }
  private getAxieAvatar(rawUserData: userLink){
    this.user.userAvatar = new Axie({
      id: rawUserData.avatar.split('/')[5]
    });
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Hunting your axies please wait ...'
    });
    await this.loading.present();
  }
}
