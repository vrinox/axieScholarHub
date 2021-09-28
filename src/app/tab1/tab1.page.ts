import { Component, OnInit } from '@angular/core';
import { Axie } from '../models/axie';
import { scholarOfficialData } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from '../services/api-tracker.service';
import { AxieTechApiService } from '../services/axie-tech-api.service';
import { FireServiceService } from '../services/fire-service.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  list: {axie:Axie, scholar:Scholar}[] = [];
  scholars: Scholar[] = [];
  firstPlace: {axie:Axie, scholar:Scholar};
  secondPlace: {axie:Axie, scholar:Scholar};
  thirdPlace: {axie:Axie, scholar:Scholar};
  ready: boolean = false;
  constructor(
    private fire: FireServiceService,
    private apiTraker: ApiTrackerService,
    private axieTechService: AxieTechApiService) {
  }
  ngOnInit(){
    this.init();
  }
  private async init(){
    await this.obtainDataFromDB();
    this.orderDataAndAsingWinners();
    this.ready = true;
    this.actualizarDatos();
  }
  private async getAxieAvatar(roninAddress: string){
    const axie = new Axie();
    const userLink = await this.apiTraker.getUserLink('roninAddress', roninAddress);
    axie.id = (userLink)?userLink.avatar.split('/')[5] : "";
    return axie;
  }
  async obtainDataFromDB(){
    this.scholars = await this.fire.getScholars();
    this.list = await Promise.all(this.scholars.map(async (scholar: Scholar)=>{
      return await this.createItemList(scholar);
    }));
  }
  async createItemList(scholar:Scholar):Promise<{axie:Axie, scholar:Scholar}>{
    const axie = await this.getAxieAvatar(scholar.roninAddress);
      return {
        scholar: scholar,
        axie: axie
      }
  }
  orderDataAndAsingWinners(){
    this.list.sort((a,b)=>{
      return b.scholar.monthSLP - a.scholar.monthSLP;
    });
    this.firstPlace = this.list.shift();
    this.secondPlace = this.list.shift();
    this.thirdPlace = this.list.shift();
  }
  async obtainDataFromAPI(){
    const data: scholarOfficialData[] = await this.axieTechService.getScholarsAPIData(this.scholars);
    this.list = await Promise.all(data.map(async (scholarData: scholarOfficialData )=>{
      const scholar = this.scholars.find(sh => sh.roninAddress === scholarData.ronin_address)
      scholar.update(new Scholar().parse(scholarData));
      return await this.createItemList(scholar);
    }));
    this.orderDataAndAsingWinners();
  }
  actualizarDatos(){
    this.obtainDataFromAPI();
  }
}
