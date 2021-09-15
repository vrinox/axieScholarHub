import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Axie } from '../models/axie';
import { Battle } from '../models/battle';
import { scholarOfficialData, userCloudData, userLink } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from './api-tracker.service';
import { AxieApiService } from './axie-api.service';
import { StorageService } from './storage.service';

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
    private axieService: AxieApiService,
    private load: LoadingController,
    private trackerService: ApiTrackerService
  ) { }

  public async sesionInit(uid:string, type: string) {
    await this.presentLoading();
    let rawUser: userCloudData;
    if(type == "login") {
      rawUser = await this.trackerService.getUserData(uid);
    } else {
      rawUser = await this.storage.getUser();
    }
    this.storage.setUser(rawUser);
    this.infinity = new Scholar(rawUser.scholar);
    this.axies = rawUser.axies?.map((rawAxie)=>{
      return new Axie(rawAxie);
    });
    this.user = rawUser.userData;
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
    });
    this.axieService.getAllAccountData(roninAddress).then((updatedData:scholarOfficialData)=>{
      const updatedScholar = new Scholar();
      updatedScholar.parse(updatedData);
      this.infinity.update(updatedScholar);
    });
    this.axieService.getBattles(this.infinity.roninAddress).then((data)=>{
      this.battles = data.map((rawBattle)=>{
        return new Battle(rawBattle);
      })
    })
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Hunting your axies please wait ...'
    });
    await this.loading.present();
  }
}
