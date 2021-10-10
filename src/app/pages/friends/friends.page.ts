import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { fromEvent, of } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { friendRequest, userList } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { ApiTrackerService } from 'src/app/services/api-tracker.service';
import { FriendService } from 'src/app/services/friend.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: HTMLIonSearchbarElement;
  isSearching: boolean;
  isSearchingUsers: boolean = false;
  friendsList: userList[] = [];
  solicitudes: friendRequest[] = [];
  searchList: userList[] = [];
  constructor(
    private apiTrackerService: ApiTrackerService,
    private alertController: AlertController,
    private friendService: FriendService,
    private sesion: SesionService,
    private toastController: ToastController
    ) { 
  }

  async ngOnInit() {
    this.solicitudes = await this.friendService.getFriendRequest(this.sesion.infinity.roninAddress);
    this.friendsList = await this.getFriends();
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
        const list: userList[] = await Promise.all(res.docs.map(async (doc)=>{
          const scholar = new Scholar(doc.data());
          return await this.apiTrackerService.createItemList(scholar);
        }))
        this.searchList = list.filter((itemList)=>{
          return itemList.scholar.roninAddress !== this.sesion.infinity.roninAddress
        });
        this.isSearchingUsers = (list.length !== 0);
        this.isSearching = false;
      }, (err) => {
        this.isSearching = false;
        console.log('error', err);
      });
    });
  }
  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.apiTrackerService.getUser(term);
  }
  friendRequest(user: userList){
    if(this.isUserInFriendsList(user.scholar.roninAddress)){
      this.presentToast('Ya se encuentra dentro de tu lista de amigos', 'danger', 'close-circle-outline')
    } else {
      this.presentAlertConfirm(user);
    }
  }
  isUserInFriendsList(roninAddress: string){
    return this.friendsList.find((user:userList)=>{
      return user.scholar.roninAddress === roninAddress
    })
  }
  accept(solicitud: friendRequest){
    this.friendService.acceptRequest(solicitud);
    this.solicitudes.filter((request)=>{
      return request.id !== solicitud.id
    })
  }
  reject(solicitud: friendRequest){
    this.friendService.rejectFriendRequest(solicitud);
    this.solicitudes.filter((request)=>{
      return request.id !== solicitud.id
    })
  }
  async getFriends(){
    const addressList = await this.friendService.getFriendsAddressList(this.sesion.infinity.roninAddress);
    const users = await Promise.all(addressList.map(async (roninAddress: string)=>{
      const user: Scholar = await this.apiTrackerService.getScholar('roninAddress', roninAddress);
      return await this.apiTrackerService.createItemList(user);
    }));
    return users;
  }
  async presentAlertConfirm(userRequested: userList) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `desea enviar una invitacion de amistad a ${userRequested.scholar.name}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Okay',
          handler:async () => {
            const requestId = await this.friendService.createRequest(
              this.sesion.infinity.roninAddress,
              this.sesion.infinity.name,
              userRequested.scholar.roninAddress);
            this.searchList = [];
            this.isSearchingUsers = false;
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
  async update(){
    this.cleanList();
    setTimeout(async () => {
      this.solicitudes = [];
      this.friendsList = [];
      this.solicitudes = await this.friendService.getFriendRequest(this.sesion.infinity.roninAddress);
      this.friendsList = await this.getFriends();
      await this.presentToast('requests updated', 'primary', 'sync');
    }, 100);
  }
  cleanList(){
    this.searchList = [];
    this.isSearchingUsers = false;
  }
}
