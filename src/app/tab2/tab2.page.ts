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
  options: { label: string, value: any, type?: string }[];
  constructor(
    private storyService: HistoricService,
    private sesion: SesionService
  ) {
    this.sesion.sesionUpdate$.subscribe(async (updatedScholar: Scholar) => {
      if (updatedScholar) {
        this.updateOptions(updatedScholar);
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
      return a.lastUpdate.getDate() - b.lastUpdate.getDate();
    }).map((scholar: Scholar) => {
      return {
        label: scholar.lastUpdate.getDate(),
        value: scholar.todaySLP
      }
    });
  }
  updateOptions(scholar: Scholar) {
    this.options = [{
      value: scholar.totalSLP,
      label: 'Total',
      type: 'slp'
    }, {
      value: scholar.todaySLP,
      label: 'Hoy',
      type: 'slp'
    },
    {
      value: scholar.monthSLP,
      label: 'Mes',
      type: 'slp'
    }, {
      value: scholar.yesterdaySLP,
      label: 'Ayer',
      type: 'slp'
    }, {
      value: scholar.MMR,
      label: 'Copas',
      type: 'mmr'
    }];

  }
}
