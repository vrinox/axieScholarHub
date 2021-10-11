import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  ToastController } from '@ionic/angular';
import { Axie } from 'src/app/models/axie';
import { scholarOfficialData, userList } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { ApiTrackerService } from 'src/app/services/api-tracker.service';
import { AxieTechApiService } from 'src/app/services/axie-tech-api.service';
import { ComunityService } from 'src/app/services/community.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
@Component({
  selector: 'app-rank',
  templateUrl: './rank.page.html',
  styleUrls: ['./rank.page.scss'],
})
export class RankPage implements OnInit {  
  list: userList[]= [];
  scholars: Scholar[] = [];
  firstPlace: userList;
  secondPlace: userList;
  thirdPlace: userList;
  ready: boolean = false;
  constructor(private toastController: ToastController,
    private fire: FireServiceService,
    private apiTracker: ApiTrackerService,
    private axieTechService: AxieTechApiService,
    private communityService: ComunityService
  ) { }

  ngOnInit(){
    this.init();
  }
  private async init(){
    await this.obtainDataFromDB('members');
    this.orderDataAndAsingWinners();
    this.ready = true;
    this.actualizarDatos();
  }
  
  async obtainDataFromDB(from:string){
    if(from === 'members'){
      this.scholars = this.communityService.activeCommunity.members;
    } else if (from === 'addressList'){
      const memberAddressList = await this.communityService.getMembersAddressList(this.communityService.activeCommunity.id);
      this.scholars = await this.fire.getScholarsByAddressList(memberAddressList);
    }
    this.list = await Promise.all(this.scholars.map(async (scholar: Scholar)=>{
      return await this.apiTracker.createItemList(scholar);
    }));
    
  }
  
  orderDataAndAsingWinners(){
    const rankType = this.communityService.activeCommunity.rankType;
    this.list.sort((a,b)=>{
      return b.scholar[rankType] - a.scholar[rankType];
    });
    this.firstPlace = this.list.shift();
    this.secondPlace = this.list.shift();
    this.thirdPlace = this.list.shift();
  }
  async obtainDataFromAPI(){
    this.presentToast();
    const data: scholarOfficialData[] = await this.axieTechService.getScholarsAPIData(this.scholars);
    this.list = await Promise.all(data.map(async (scholarData: scholarOfficialData )=>{
      const scholar = this.scholars.find(sh => sh.roninAddress === scholarData.ronin_address)
      scholar.update(new Scholar().parse(scholarData));
      return await this.apiTracker.createItemList(scholar);
    }));
    this.orderDataAndAsingWinners();
  }
  async actualizarDatos(){
    this.list = [];
    this.scholars = [];
    await this.obtainDataFromDB('addressList');
    this.obtainDataFromAPI();
  }  
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'updating data ',
      duration: 2000,
      position: 'top',
      color: "primary",
      buttons: [
        {
          side: 'end',
          icon: 'sync-outline'
        }
      ]
    });
    toast.present();
  }
}
