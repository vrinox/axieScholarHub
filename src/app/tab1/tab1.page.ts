import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { communityRequest } from '../models/interfaces';
import { Scholar } from '../models/scholar';
import { ApiTrackerService } from '../services/api-tracker.service';
import { ComunityService } from '../services/community.service';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  community: any = null;
  feedPlaceHolder: string = "Aqui van los mensajes de la comunidad";
  admin: boolean =false;
  constructor(
    private sesion: SesionService,
    private communityService: ComunityService,
    private apiTracker: ApiTrackerService,
    private router: Router,
    private toastController: ToastController
  ) {
   
  }
  async ngOnInit() {
    this.community = (this.sesion.communities && this.sesion.communities.length !== 0)? this.sesion.communities[0]: null;
    if(this.community){
      this.community.feed= [];
      this.community.solicitudes = [];
      const communityComplement = await this.buildCommunity(this.community.id);
      this.community.members = communityComplement.members;
      this.community.rank = communityComplement.rank;
      this.community.feed = communityComplement.feed;
      this.community.solicitudes = communityComplement.solicitudes || [];
      this.admin = (this.community.admin === this.sesion.infinity.roninAddress);
      this.communityService.activeCommunity = this.community;
    }
  }
  async buildCommunity(communityId:string){
    const community:any = {};
    community.members = await this.getMembers(communityId);
    community.rank = await this.buildRank(community.members);;
    community.feed = await this.communityService.getFeed(communityId, community.members.map(member => member.roninAddress));
    community.solicitudes = await this.communityService.getRequests(communityId);
    return community;
  }
  async getMembers(communityId){
    const membersAddressList = await this.communityService.getMembersAddressList(communityId);    
    const members = await Promise.all(membersAddressList.map((roninAddress: string)=>{
      return this.apiTracker.getScholar('roninAddress', roninAddress);
    }));
    members.sort((a: Scholar,b: Scholar)=>{
      return b[this.community.rankType] - a[this.community.rankType]
    });
    return members;    
  }
  async buildRank(members: Scholar[]){
    let rank: any = {};
    rank.firstPlace = await this.apiTracker.createItemList(members[0]);
    if(members[1]){
      rank.secondPlace = await this.apiTracker.createItemList(members[1]);
    }
    if(members[2]){
      rank.thirdPlace = await this.apiTracker.createItemList(members[2]);
    }
    return rank;
  }
  navigate(destiny:string){
    if(destiny === 'join'){
      this.router.navigate(['join-community']);
    } else if(destiny === 'create'){
      this.router.navigate(['create-community']);
    } else if(destiny === 'rank'){
      this.router.navigate(['rank']);
    } else if(destiny === 'feed'){
      this.router.navigate(['community-feed']);
    }
  }
  
  async accept(solicitud: communityRequest){
    await this.communityService.acceptRequest(solicitud);
    this.presentToast('Solicitud aceptada', 'primary', 'checkmark-circle-outline');
    this.community.solicitudes = this.community.solicitudes.filter((request)=>{
      return request.id !== solicitud.id
    });
    this.community.members = await this.getMembers(this.community.id);
    this.community.rank = await this.buildRank(this.community.members);
  }
  async reject(solicitud: communityRequest){
    await this.communityService.rejectRequest(solicitud);
    this.presentToast('Solicitud denegada', 'primary', 'checkmark-circle-outline');
    this.community.solicitudes = this.community.solicitudes.filter((request)=>{
      return request.id !== solicitud.id
    })
  }
  async presentToast(text: string, color:string, icon: string){
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top',
      color: color,
      buttons: [
        {
          side: 'end',
          icon: icon
        }
      ]
    });
    toast.present();
  }
}
