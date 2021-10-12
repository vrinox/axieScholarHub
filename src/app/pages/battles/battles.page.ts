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
  list : {battles:Battle[], title:string, win:number, lose:number, show:boolean}[] = [];
  loading: HTMLIonLoadingElement;
  constructor(
    private sesion: SesionService,
    private axieTechService: AxieTechApiService,
    private load: LoadingController,
    private lunacianService: lunacianApiService
  ) { }

  ngOnInit() {
    if(this.list.length === 0){
      this.getAllBattles();
    }
  }
  async getAllBattles(){
    if(this.sesion.assembledFlag){
      const assembledBattles = await this.sesion.getAssembledBattles();
      assembledBattles.forEach((battle:Battle)=>{
        this.organizeList(battle);
      })
    }
    if(this.list.length === 0){
      this.presentLoading();
      this.getAndAssebleBattles(); 
    }
  }
  actualizarDatos(){
    this.list = [];
    this.presentLoading();
    this.getAndAssebleBattles();
  }
  getAndAssebleBattles(){
    const battles: Battle[] = [];
    Promise.all(this.sesion.battles?.map(async (battle: Battle)=>{
      battle.myName = this.sesion.infinity.name;
      const battleAssembled = await this.axieTechService.assembleBattle(battle, this.sesion.user.roninAddress);
      this.organizeList(battleAssembled);
      battles.push(battleAssembled);
      if(this.list.length === 1){
        this.loading.dismiss();
      } 
      if (battles.length === this.sesion.battles.length){
        this.sesion.setAssembledBattles(battles);
      }
    }));
  }
  organizeList(battle: Battle){
    const theDate = new Date(battle.created_at);
    const label: string = `${theDate.getUTCDate()} of ${theDate.toLocaleString('default', { month: 'long' })}`;
    const day = this.list.find((existingDay)=>{
      return existingDay.title === label;
    })
    if(day){
      (battle.win)? day.win++: day.lose++;
      day.battles.push(battle);
      day.battles.sort((a,b)=>{
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    } else {
      this.list.push({
        battles: [battle],
        title: label,
        lose: (battle.win)? 0: 1,
        win: (battle.win)? 1: 0,
        show: false
      });
    }
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Fetching all the battles data'
    });
    await this.loading.present();
  }

  mostrar(day: any){
    day.show = !day.show;
  }
}
