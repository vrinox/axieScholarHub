import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Battle } from '../models/battle';
import { AxieTechApiService } from '../services/axie-tech-api.service';
import { lunacianApiService } from '../services/lunacian-api.service';
import { SesionService } from '../services/sesion.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  battles: Battle[] = [];
  loading: HTMLIonLoadingElement;
  constructor(
    private sesion:SesionService,
    private axieTechService: AxieTechApiService,
    private load: LoadingController,
    private lunacianService: lunacianApiService
    ) {
    
  }
  ngOnInit(){
    this.getAllBattles();
    
  }

  async getAllBattles(){
    if(this.sesion.battles){
      this.presentLoading();
      this.battles = await Promise.all(this.sesion.battles?.map((battle: Battle)=>{
        battle.myName = this.sesion.infinity.name;
        return this.axieTechService.assembleBattle(battle, this.sesion.user.roninAddress);
      }));
      this.loading.dismiss();
    }
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Fetching all the battles data'
    });
    await this.loading.present();
  }

  async showRep(battle: Battle){
    this.lunacianService.replay(battle.replay);
  }
}
