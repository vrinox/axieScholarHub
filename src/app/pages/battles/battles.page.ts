import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Battle } from 'src/app/models/battle';
import { AxieTechApiService } from 'src/app/services/axie-tech-api.service';
import { lunacianApiService } from 'src/app/services/lunacian-api.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-battles',
  templateUrl: './battles.page.html',
  styleUrls: ['./battles.page.scss'],
})
export class BattlesPage implements OnInit {
  battles: Battle[] = [];
  loading: HTMLIonLoadingElement;
  constructor(
    private sesion: SesionService,
    private axieTechService: AxieTechApiService,
    private load: LoadingController,
    private lunacianService: lunacianApiService
  ) { }

  ngOnInit() {
    if(this.battles.length === 0){
      this.getAllBattles();
    }
  }
  async getAllBattles(){
    if(this.sesion.assembledFlag){
      this.battles = this.sesion.battles;
    } else {
      this.presentLoading();
      Promise.all(this.sesion.battles?.map(async (battle: Battle)=>{
        battle.myName = this.sesion.infinity.name;
        const battleAssembled = await this.axieTechService.assembleBattle(battle, this.sesion.user.roninAddress);
        this.battles.push(battleAssembled);        
        if(this.battles.length === 1){
          this.loading.dismiss();
        } 
        if (this.battles.length === this.sesion.battles.length){
          this.sesion.setAssembledBattles(this.battles);
        }
      }));
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
