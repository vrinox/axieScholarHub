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
  scholarStory: any[] =[
    {value:50,label:'09'},
    {value:70,label:'10'},
    {value:235,label:'11'},
    {value:195,label:'12'},
    {value:195,label:'13'},
    {value:135,label:'14'},
    {value:167,label:'15'},
    {value:75,label:'16'},
    {value:135,label:'17'},
    {value:135,label:'18'},
    {value:135,label:'19'},
  ]
  constructor(
    private storyService: HistoricService,
    private sesion: SesionService
  ) { 
  }

  ngAfterViewInit() {
    this.sesion.sesionInit$.subscribe(async (init:boolean)=>{
      if(init === true){
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

}
