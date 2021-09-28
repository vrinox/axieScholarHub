import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Battle } from '../models/battle';
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
    private render: Renderer2,
    private lunacian: lunacianApiService
  ) {}
  
  async ngAfterViewInit(){
    this.init();
  }
  async init(){
    const battles = await this.fire.getSharedBattles();
    battles.forEach((battle)=>{
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
    } else {
      this.list.push({
        battles: [battle],
        title: label
      });
    }
  }
  open(battle:Battle){
    const a = this.render.createElement('a');
    this.render.setAttribute(a, 'href', `${this.lunacian.REST_API_SERVER}/${battle.replay}`);
    a.click();
  }
  actualizarDatos(){
    this.init();
  };
}
