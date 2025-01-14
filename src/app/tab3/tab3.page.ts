import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Battle } from '../models/battle';
import { AxieTechApiService } from '../services/axie-tech-api.service';
import { FireServiceService } from '../services/fire-service.service';
import { lunacianApiService } from '../services/lunacian-api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements AfterViewInit{
  list : {battles:Battle[], title:string}[] = [];
  constructor(
    private fire:FireServiceService,
    private lunacian: lunacianApiService,
    private axieTechService: AxieTechApiService
  ) {}
  
  async ngAfterViewInit(){
    this.init();
  }
  async init(){
    const battles = await this.fire.getSharedBattles();
    battles.forEach((battle)=>{
      battle = this.axieTechService.assembleBattleMin(battle, battle.shared.scholar.roninAddress, battle.shared);
      this.organizeList(battle);
    })
  }

  organizeList(battle: Battle){
    const theDate = new Date(battle.created_at);
    const label: string = `${theDate.getUTCDate()} of ${theDate.toLocaleString('default', { month: 'long' })}`;
    const day = this.list.find((existingDay)=>{
      return existingDay.title === label;
    })
    if(day){
      day.battles.push(battle);
      day.battles.sort((a,b)=>{
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    } else {
      this.list.push({
        battles: [battle],
        title: label
      });
    }
  }
  
  actualizarDatos(){
    this.init();
  };
}
