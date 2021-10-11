import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Axie } from '../models/axie';
import { Battle } from '../models/battle';
import { community, scholarOfficialData, userCloudData, userLink } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from './api-tracker.service';
import { lunacianApiService } from './lunacian-api.service';
import { StorageService } from './storage.service';
import { AxieTechApiService } from './axie-tech-api.service';
import { ComunityService } from './community.service';
interface sesion{
  infinity: Scholar;
  axies: Axie[];
  user?: userLink;
  battles: Battle[];
  assembledFlag?: boolean;
  communities: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  infinity: Scholar;
  axies: Axie[];
  user: userLink;
  battles: Battle[];
  communities: any[];

  sesionInit$: Subject<boolean> = new Subject();
  sesionUpdate$: Subject<Scholar> = new Subject();
  assembledFlag: boolean = false;
  slp: any = {
    price: 0
  };
  public loading: HTMLIonLoadingElement;

  constructor(
    private storage: StorageService,
    private router: Router,
    private axieService: lunacianApiService,
    private load: LoadingController,
    private trackerService: ApiTrackerService,
    private axieTechService: AxieTechApiService,
    private comunityService: ComunityService
  ) { }

  public async appStart(){    
    const user: userCloudData = await this.storage.getUser();
    if(user) {
      this.sesionInit(user.userData.uid, "start");
    } else {
      this.router.navigate(['/email-login'],{replaceUrl: true});
    }
  }

  public async sesionInit(uid:string, type: string) {
    this.sesionInit$.next(false);
    await this.presentLoading();
    let offlineSesion: sesion;
    if(type == "login") {
      offlineSesion = await this.constructSesionFromCloud(uid);
    } else {
      offlineSesion = await this.getSesionFromStorage();
    }
    this.setSesionMinOnCache(offlineSesion);
    this.setValuesIntoActiveSesion(offlineSesion);
    this.sesionInit$.next(true);
    this.getUpdatedDatafromApi(this.infinity.roninAddress);
    this.router.navigateByUrl('/tabs',{ replaceUrl: true});
    this.loading.dismiss();
  }
  setValuesIntoActiveSesion(sesion: sesion){
    this.infinity = sesion.infinity;
    this.user = sesion.user;
    this.user.userAvatar = this.getAxieAvatar(sesion.user);
    if(sesion.battles.length !== 0){
      this.battles = sesion.battles;
    }
    if(sesion.axies.length !== 0){
      this.axies = sesion.axies;
    }
    if(sesion.communities.length !== 0){
      this.communities = sesion.communities;
    }
  }
  async getSesionFromStorage():Promise<sesion>{
    const offlineSesion: sesion = {
      axies: [],
      battles: [],
      infinity: new Scholar(),
      communities: []
    }
    offlineSesion.axies = await this.getAxies();
    offlineSesion.assembledFlag = await this.storage.getAssembledFlag();
    const rawBattles: any[] = await this.storage.getBattles();
    if(rawBattles){
      offlineSesion.battles = rawBattles.map((rawBattle)=>{
        return new Battle(rawBattle);
      });
    }
    const communities = await this.storage.getCommunities();
    offlineSesion.communities = communities || [];
    const rawUser = await this.storage.getUser();
    offlineSesion.user = rawUser.userData;
    offlineSesion.infinity = new Scholar(rawUser.scholar);
    return offlineSesion;
  }
  async constructSesionFromCloud(uid: string){
    const sesion: sesion = {
      axies: [],
      battles: [],
      infinity: new Scholar(),
      communities: []
    }
    const rawUser: userCloudData = await this.trackerService.getUserData(uid);
    sesion.user = rawUser.userData;
    sesion.infinity = new Scholar(rawUser.scholar);
    const communities = await this.comunityService.getCommunities(rawUser.scholar.roninAddress);
    sesion.communities = communities || [];
    return sesion;
  }
  setSesionMinOnCache(sesion:sesion){
    this.storage.setUser({
      userData: sesion.user,
      scholar: sesion.infinity.getValues()
    });
    this.setCommunitiesOnCache(sesion.communities);
  }
  setSnapToCache(){
    this.storage.setUser({
      userData: this.user,
      scholar: this.infinity.getValues()
    });
  }
  public setCommunitiesOnCache(communities: community[]){
    this.storage.setCommunities(communities);
  }
  public getUpdatedDatafromApi(roninAddress: string){
    this.updateAxies(roninAddress);
    this.updateBattles(roninAddress);
    this.updateScholar(roninAddress);
  }  
  updateAxies(roninAddress: string){
    this.axieService.getAxies(roninAddress).then((axies:Axie[])=>{
      this.axies = axies;
      this.axieTechService.getAxiesAllData(this.axies);
      this.storage.setAxies(axies.map((axie: Axie)=>{
        return axie.getValues();
      }));
    });
  }
  updateBattles(roninAddress: string){    
    this.axieService.getBattles(roninAddress).then((battles)=>{
      this.battles = battles.map((rawBattle)=>{
        return new Battle(rawBattle);
      });
      this.storage.setAssembledFlag(false);
      this.storage.setBattles(battles);
    });
  }
  updateScholar(roninAddress: string){    
    this.axieTechService.getAllAccountData(roninAddress).then((updatedData:scholarOfficialData)=>{
      const updatedScholar = new Scholar();
      updatedScholar.parse(updatedData);
      this.infinity.update(updatedScholar);
      this.updateDBUserData();
      this.sesionUpdate$.next(this.infinity);
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
  public getAxieAvatar(rawUserData: userLink){
    return new Axie({
      id: rawUserData.avatar.split('/')[5]
    });
  }
  setAssembledBattles(battles:Battle[]){
    this.storage.setAssembledBattles(battles);
    this.storage.setAssembledFlag(true);
    this.battles = battles;
    this.assembledFlag = true;
  }  
  async getAssembledBattles():Promise<Battle[]>{
    const rawAssembledBattles = await this.storage.getAssembledBattles();
    if(rawAssembledBattles){
      return rawAssembledBattles?.map((rawBattle: any)=>{
        return new Battle(rawBattle);
      });
    } else{
      return [];
    }
  }
  async updateDBUserData(){
    const userData = await this.trackerService.getUserData(this.user.uid);
    this.storage.setUser({
      userData: this.user,
      scholar: userData.scholar
    })
  }
  
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Hunting your axies please wait ...'
    });
    await this.loading.present();
  }

  public close(){
    this.sesionInit$.next(false);
    this.storage.clear();
    this.infinity = null;
    this.axies= [];
    this.user = null;
    this.router.navigate(['/email-login'],{replaceUrl: true});
  }
}
