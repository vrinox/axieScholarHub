import { Component, OnInit } from '@angular/core';
import { Axie } from '../models/axie';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from '../services/api-tracker.service';
import { FireServiceService } from '../services/fire-service.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  list: {axie:Axie, scholar:Scholar}[] = [];
  constructor(
    private fire: FireServiceService,
    private apiTraker: ApiTrackerService) {
    
  }
  ngOnInit(){
    this.init();
  }
  private async init(){
    const scholars: Scholar[] = await this.fire.getScholars();
    this.list = await Promise.all(scholars.map(async (scholar: Scholar)=>{
      const axie = await this.getAxieAvatar(scholar.roninAddress);
      return {
        scholar: scholar,
        axie: axie
      }
    }));
    this.list.sort((a,b)=>{
      return b.scholar.monthSLP - a.scholar.monthSLP;
    });
  }
  private async getAxieAvatar(roninAddress: string){
    const axie = new Axie();
    const userLink = await this.apiTraker.getUserLink('roninAddress', roninAddress);
    axie.id = (userLink)?userLink.avatar.split('/')[5] : "";
    return axie;
  }
  
}
