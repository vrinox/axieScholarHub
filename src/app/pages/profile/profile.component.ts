import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Axie } from 'src/app/models/axie';
import { Battle } from 'src/app/models/battle';
import { userLink } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { ActiveProfileService } from 'src/app/services/active-profile.service';
import { AxieTechApiService } from 'src/app/services/axie-tech-api.service';
import { lunacianApiService } from 'src/app/services/lunacian-api.service';
import { SesionService } from 'src/app/services/sesion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  battles: Battle[] = [];
  wins: number = 0;
  lose: number = 0;
  winRate: string = '0';
  loading: HTMLIonLoadingElement;
  axie: Axie;
  axies: Axie[] = []; 
  constructor(
    public authService: AuthService,
    public sesion: SesionService,
    private axieTechService: AxieTechApiService,
    private lunacianService: lunacianApiService,
    private load: LoadingController,
    private profileService: ActiveProfileService
  ) { }

  async ngOnInit() {
    const active = this.profileService.active;
    const axieData = await this.axieTechService.getAxieData(active.user.userAvatar.id);    
    this.axie = new Axie(axieData);
    const battles: Battle[] = await this.getMinBattles(active.user, active.battles, active.scholar);    
    this.presentLoading();
    this.battles = await Promise.all(battles.slice(0,3).map(async (minBattle: Battle)=>{
      return await this.axieTechService.assembleBattle(minBattle, active.user.roninAddress);
    }));
    this.loading.dismiss();
    battles.forEach((battle: Battle)=>{
      (battle.winner)? this.wins++ : this.lose++;
    });
    this.winRate = (this.wins * 100 / active.battles.length).toFixed(0);
  }
  async getMinBattles(sUser: userLink, sBattles: Battle[], sScholar: Scholar){
    let battles: Battle[] = [];    
    battles = sBattles?.map((battle: Battle)=>{
      battle.myName = sScholar.name;
      return this.axieTechService.assembleBattleMin(battle, sUser.roninAddress);
    });
    return battles;
  }
  async showRep(battle: Battle){
    this.lunacianService.replay(battle.replay);
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Fetching all the battles data'
    });
    await this.loading.present();
  }
  signOut() {
    this.authService.logout();
  }
}