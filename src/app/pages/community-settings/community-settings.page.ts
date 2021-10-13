import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { community, communityRequest, userList } from 'src/app/models/interfaces';
import { Scholar } from 'src/app/models/scholar';
import { ApiTrackerService } from 'src/app/services/api-tracker.service';
import { ComunityService } from 'src/app/services/community.service';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-community-settings',
  templateUrl: './community-settings.page.html',
  styleUrls: ['./community-settings.page.scss'],
})
export class CommunitySettingsPage implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = true;
  loading: HTMLIonLoadingElement;
  scholars: Scholar[] = [];  
  list: userList[]= [];
  constructor(
    private formBuilder: FormBuilder,
    private communityService: ComunityService,
    private sesion: SesionService,
    private load: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private fire: FireServiceService,
    private apiTracker: ApiTrackerService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const active = this.communityService.activeCommunity;
    this.registerForm = this.formBuilder.group(
      {
        name: [active.name, Validators.required],
        rankType: [active.rankType, Validators.required],
        discord: [active.discord],
        type: [(active.type === 'academy')]
      }
    );
    this.obtainDataFromDB('members');
  }
  async enviar() {
    const active = this.communityService.activeCommunity;
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    await this.presentLoading(this.registerForm.value.name);
    const type = (this.registerForm.value.type) ? 'academy' : 'friends';
    let nameExists = await this.communityService.communityExists(this.registerForm.value.name);
    if(this.registerForm.value.name !== active.name && nameExists){
      this.loading.dismiss();
      this.presentToast(`El nombre ${this.registerForm.value.name} ya esta en uso intente con otro`, 'danger', 'close-circle-outline');
      return;
    }    
    const community: community = await this.communityService.updateCommunity(active.id, {
      name: this.registerForm.value.name,
      type: type,
      discord: this.registerForm.value.discord,
      rankType: this.registerForm.value.rankType
    });
    if (community) {
      this.sesion.communities = [community];
      this.sesion.setCommunitiesOnCache(this.sesion.communities);
      this.communityService.updateActive(community);
      active.rank = await this.communityService.buildRank(active);
      this.communityService.activeUpdate$.next(active);
      this.presentToast(`${this.registerForm.value.name} ha sido actualizado`, 'primary', 'checkmark-outline');
    } else {
      this.presentToast(`Error al modificar ${this.registerForm.value.name} por favor intente mas tarde`, 'danger', 'close-circle-outline');
    }
    this.loading.dismiss();
  }
  async presentLoading(name) {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Modificando ' + name
    });
    await this.loading.present();
  }
  async presentToast(text: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'bottom',
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
  async obtainDataFromDB(from:string){
    let  active = this.communityService.activeCommunity;
    if(from === 'members'){
      this.scholars = active.members;
    } else if (from === 'addressList'){
      active = await this.communityService.buildCommunity(active);
      this.scholars = active.members;
      this.communityService.activeUpdate$.next(active);
    }
    this.list = await Promise.all(this.scholars.map(async (scholar: Scholar)=>{
      return await this.apiTracker.createItemList(scholar);
    }));
    
  }
  kick(item:userList){
    this.showConfirm(item.scholar);
  }
  showConfirm(scholar:Scholar) {
    this.alertController.create({
      message: `deseas kicker a ${scholar.name} de la comunidad`,
      backdropDismiss: false,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'kick',
        handler: async () => {
          await this.communityService.kick(scholar.roninAddress, this.communityService.activeCommunity.id);
          this.obtainDataFromDB('addressList');
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
  eliminate(){
    this.alertController.create({
      message: `deseas eliminar la comunidad`,
      backdropDismiss: false,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Borrar',
        handler: async () => {
          await this.communityService.deleteCommunity(this.communityService.activeCommunity.id);
          this.router.navigateByUrl('/tabs',{ replaceUrl: true});
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
  
  async accept(solicitud: communityRequest){
    let active = this.communityService.activeCommunity;
    await this.communityService.acceptRequest(solicitud);
    this.presentToast('Solicitud aceptada', 'primary', 'checkmark-circle-outline');
    active.solicitudes = active.solicitudes.filter((request)=>{
      return request.id !== solicitud.id
    });
    active = await this.communityService.buildCommunity(active);
    this.scholars = active.members;
    this.communityService.activeUpdate$.next(active);
  }
  async reject(solicitud: communityRequest){    
    const active = this.communityService.activeCommunity;
    await this.communityService.rejectRequest(solicitud);
    this.presentToast('Solicitud denegada', 'primary', 'checkmark-circle-outline');
    active.solicitudes = active.solicitudes.filter((request)=>{
      return request.id !== solicitud.id
    })
  }
}
