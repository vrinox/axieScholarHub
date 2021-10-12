import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  axie: Axie;
  axies: Axie[] = [];
  constructor(
    public authService: AuthService,
    public sesion: SesionService,
    private axieTechService: AxieTechApiService,
    private lunacianService: lunacianApiService,
    private profileService: ActiveProfileService,
    private router: Router
  ) { }

  async ngOnInit() {
    const active = this.profileService.active;
    await this.getAxieAvatar(); 
    if(active.battles.length === 0){
      this.getBattles(active.scholar.roninAddress).then((battles: Battle[])=>{
        active.battles = this.calculateBattles(battles);
        this.getAssembledBattles(battles, active.scholar.roninAddress);
      })
    } else {
      active.battles = this.getMinBattles(active.user,active.battles, active.scholar);
      active.battles = this.calculateBattles(active.battles);
      this.getAssembledBattles(active.battles, active.scholar.roninAddress);
    }
    if(active.axies.length === 0){
      this.getAxies(active.scholar.roninAddress).then((axies)=>{
        active.axies = axies;
      })
    }    
  }
  calculateBattles(battles: Battle[]){
    battles.forEach((battle: Battle)=>{
      (battle.win)? this.wins++ : this.lose++;
    });
    this.winRate = (this.wins * 100 / battles.length).toFixed(0);
    return battles;
  }
  async getAssembledBattles(battles: Battle[], roninAddress: string){
    this.battles = await Promise.all(battles.slice(0,3).map(async (minBattle: Battle)=>{
      return await this.axieTechService.assembleBattle(minBattle, roninAddress);
    }));
  }
  getMinBattles(sUser: userLink, sBattles: Battle[], sScholar: Scholar){
    let battles: Battle[] = [];    
    battles = sBattles?.map((battle: Battle)=>{
      battle.myName = sScholar.name;
      return this.axieTechService.assembleBattleMin(battle, sUser.roninAddress);
    });
    return battles;
  }
  getAxies(roninAddress){    
    return this.lunacianService.getAxies(roninAddress);
  }
  async getBattles(roninAddress){
    const active = this.profileService.active;
    let battles: Battle[] = await this.lunacianService.getBattles(roninAddress);
    battles = this.getMinBattles(active.user, battles, active.scholar);
    return battles
  }
  async getAxieAvatar(){
    const axieData = await this.axieTechService.getAxieData(this.profileService.active.user.userAvatar.id);
    this.profileService.active.axieAvatar = new Axie(axieData);
  }
  async showRep(battle: Battle){
    this.lunacianService.replay(battle.replay);
  }
  signOut() {
    this.authService.logout();
  }
  navigateToSettings(){
    this.router.navigate(['settings']);
  }
}