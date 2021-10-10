import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { fromEvent, of } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import {community } from 'src/app/models/interfaces';
import { ComunityService } from 'src/app/services/community.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-join-community',
  templateUrl: './join-community.page.html',
  styleUrls: ['./join-community.page.scss'],
})
export class JoinCommunityPage implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: HTMLIonSearchbarElement;
  isSearching: boolean;
  communitiesQuery: community[] = [];
  constructor(
    private communityService: ComunityService,
    private sesion: SesionService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    fromEvent(await this.searchInput.getInputElement(), 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 2),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {

      this.isSearching = true;

      this.searchGetCall(text).subscribe(async (res) => {
        const list: community[] = await Promise.all(res.docs.map(async (doc)=>{
          const community = doc.data();
          community.id = doc.id;
          community.members = await this.communityService.getMembersAddressList(doc.id);
          return community;
        }))
        this.communitiesQuery = list;
        this.isSearching = false;
      }, (err) => {
        this.isSearching = false;
        console.log('error', err);
      });
    });
  }
  async joinCommunity(community: community){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Desea enviar una solicitud a ${community.name}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Okay',
          handler:async () => {
            const requestId = await this.communityService.createCommunityRequest(
              this.sesion.infinity.roninAddress,
              this.sesion.infinity.name,
              community.id);
            this.communitiesQuery = [];
            if(requestId){
              this.presentOkToast();
            } else{
              this.presentKOToast();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentOkToast(){
    await this.presentToast('Solicitud enviada', 'primary', 'checkmark-outline');
  }
  async presentKOToast(){
   await this.presentToast('Ha sucedido un error por favor intentelo de nuevo', 'danger', 'close-circle-outline');
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
  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.communityService.getCommunitiesByPartialName(term);
  }
  cleanList(){
    this.communitiesQuery = [];
  }
}
