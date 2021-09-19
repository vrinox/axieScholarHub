import { AfterViewInit, Component} from '@angular/core';
import { Scholar } from '../models/scholar';
import { HistoricService } from '../services/historic.service';
import { SesionService } from '../services/sesion.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit {
  scholarStory: any[] = [];
  options: {label:string, value:any, class?:string}[];
  constructor(
    private storyService: HistoricService,
    private sesion: SesionService
  ) { 
  }

  ngAfterViewInit() {
    this.sesion.sesionInit$.subscribe(async (init:boolean)=>{
      if(init === true){
        this.initOptions();
        const story: Scholar[] = await this.storyService.getHistoric(this.sesion.infinity.roninAddress);
        this.scholarStory = story.sort((a:Scholar,b:Scholar)=>{
          return a.lastUpdate.getDate() - b.lastUpdate.getDate();
        }).map((scholar: Scholar)=>{
          console.log(scholar.lastUpdate);
          return {
            label: scholar.lastUpdate.getDate(),
            value: scholar.todaySLP
          }
        });
      }
    })
  }
  initOptions(){
    this.options = [{
      value: this.sesion.infinity.totalSLP,
      label: 'Total Slp'
    }];

  }
}
