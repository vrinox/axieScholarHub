import { AfterViewInit, Component } from '@angular/core';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from '../services/api-tracker.service';
import { HistoricService } from '../services/historic.service';
import { SesionService } from '../services/sesion.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements AfterViewInit {
  scholarStory: any[] = [];
  allScholarStory: any[] = [];
  options: { label: string, value: any, type?: string, alto?: number, bajo?: number }[];
  constructor(
    private storyService: HistoricService,
    private sesion: SesionService,
    private apiTrackerService: ApiTrackerService
  ) {
    this.sesion.sesionUpdate$.subscribe(async (updatedScholar: Scholar) => {
      if (updatedScholar) {
        this.updateOptions(updatedScholar);
        this.obtainDataAndDraw();
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.obtainDataAndDraw();
    }, 1000)
  }

  changeStoryRange(days: number) {
    this.scholarStory = this.allScholarStory.slice(-1 * days);
  }

  async obtainDataAndDraw() {
    if (this.sesion.infinity) {
      this.updateOptions(this.sesion.infinity);
      const story: Scholar[] = await this.storyService.getHistoric(this.sesion.infinity.roninAddress);
      this.allScholarStory = story.sort((a: Scholar, b: Scholar) => {
        return a.lastUpdate.valueOf() - b.lastUpdate.valueOf();
      })
      this.drawChartData(7);
    }
  }
  drawChartData(days){
    let data =  this.allScholarStory.slice(-days).map((scholar: Scholar) => {
      return {
        label: `${scholar.lastUpdate.getDate()}/${scholar.lastUpdate.getMonth()+1}`,
        value: scholar.todaySLP
      }
    });
    
    this.scholarStory = data;
  }
  updateOptions(scholar: Scholar) {
    if (scholar) {
      console.log("today",scholar);
      const dias = new Date().getDate() - 1;
      this.options = [{
        value: scholar.inGameSLP,
        label: 'In Game',
        type: 'slp'
      }, {
        value: scholar.todaySLP,
        label: 'Hoy',
        type: 'slp',
        alto: 75,
        bajo: 50
      },
      {
        value: scholar.monthSLP,
        label: 'Mes',
        type: 'slp',
        alto: 75 * dias,
        bajo: 50 * dias
      }, {
        value: scholar.yesterdaySLP,
        label: 'Ayer',
        type: 'slp',
        alto: 75,
        bajo: 50
      }, {
        value: scholar.MMR,
        label: 'Copas',
        type: 'mmr'
      }];
      if (scholar.ganancia !== 0 && scholar.ganancia !== 100 && !isNaN(scholar.ganancia)) {
        this.options.splice(1, 0, {
          value: scholar.inGameSLP * scholar.ganancia / 100,
          label: 'Total Ganado',
          type: 'slp'
        });
      }
    }
  }
  parse(value: number) {
    return value.toFixed(2);
  }
  async actualizarDatos() {
    this.sesion.infinity = await this.apiTrackerService.getScholar('roninAddress', this.sesion.infinity.roninAddress);
    this.sesion.getUpdatedDatafromApi(this.sesion.infinity.roninAddress);
  }
}
