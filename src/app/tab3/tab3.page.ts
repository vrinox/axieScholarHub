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
  battles: Battle[] = [];
  constructor(
    private fire:FireServiceService,
    private render: Renderer2,
    private lunacian: lunacianApiService
  ) {}
  
  async ngAfterViewInit(){
    this.battles = await this.fire.getSharedBattles();
  }

  
  open(battle:Battle){
    const a = this.render.createElement('a');
    this.render.setAttribute(a, 'href', `${this.lunacian.REST_API_SERVER}/${battle.replay}`);
    a.click();
  }
}
