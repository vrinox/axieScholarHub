import { AfterViewInit, Component } from '@angular/core';
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
  options: { label: string, value: any, type?: string, alto?:number, bajo?:number }[];
  constructor(
    private storyService: HistoricService,
    private sesion: SesionService
  ) {
    this.sesion.sesionUpdate$.subscribe(async (updatedScholar: Scholar) => {
      if (updatedScholar) {
        this.updateOptions(updatedScholar);
        this.obtainDataAndDraw();
      }
    })
  }

  ngAfterViewInit() {
   setTimeout(()=>{
    this.obtainDataAndDraw();
   },1000)
  }
  
  async obtainDataAndDraw() {
    this.updateOptions(this.sesion.infinity);
    const story: Scholar[] = await this.storyService.getHistoric(this.sesion.infinity.roninAddress);
    this.scholarStory = story.sort((a: Scholar, b: Scholar) => {
      return a.lastUpdate.valueOf() - b.lastUpdate.valueOf();
    })
    .slice(-7)
    .map((scholar: Scholar) => {
      return {
        label: scholar.lastUpdate.getDate(),
        value: scholar.todaySLP
      }
    });
  }
  updateOptions(scholar: Scholar) {
    const dias = new Date().getDate() - 1;
    this.options = [{
      value: scholar.totalSLP,
      label: 'Total',
      type: 'slp'
    }, {
      value: scholar.totalSLP * scholar.ganancia / 100,
      label: 'Total Ganado',
      type: 'slp'
    },{
      value: scholar.todaySLP,
      label: 'Hoy',
      type: 'slp',
      alto:75,
      bajo:50
    },
    {
      value: scholar.monthSLP,
      label: 'Mes',
      type: 'slp',
      alto: 75*dias,
      bajo: 50*dias
    }, {
      value: scholar.yesterdaySLP,
      label: 'Ayer',
      type: 'slp',
      alto:75,
      bajo:50
    }, {
      value: scholar.MMR,
      label: 'Copas',
      type: 'mmr'
    }];
  }
  parse(value: number){
    return value.toFixed(2);
  }
  actualizarDatos(){
    this.sesion.getUpdatedDatafromApi(this.sesion.infinity.roninAddress);
  }
}
