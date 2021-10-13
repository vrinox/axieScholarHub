import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { community, communityRequest } from '../models/interfaces';
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
    private router: Router,
    private toastController: ToastController
  ) {
    this.communityService.activeUpdate$.subscribe( (communityUpdated: community)=>{
      if(communityUpdated){
        this.community = communityUpdated;
      }
    });
  }
  async ngOnInit() {
    this.community = (this.sesion.communities && this.sesion.communities.length !== 0)? this.sesion.communities[0]: null;
    if(this.community){
      this.community.feed = [];
      this.community.solicitudes = [];
      const communityComplement = await this.communityService.buildCommunity(this.community);
      Object.assign(this.community, communityComplement);
      this.admin = (this.community.admin === this.sesion.infinity.roninAddress);
      this.communityService.activeCommunity = this.community;
    }
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
  navigateToSettings(){
    this.router.navigate(['community-settings']);
  }
}
