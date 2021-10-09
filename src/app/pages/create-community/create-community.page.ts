import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { community } from 'src/app/models/interfaces';
import { ComunityService } from 'src/app/services/community.service';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.page.html',
  styleUrls: ['./create-community.page.scss'],
})
export class CreateCommunityPage implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = true;
  loading: HTMLIonLoadingElement;
  constructor(
    private formBuilder: FormBuilder,
    private communityService: ComunityService,
    private sesion: SesionService,
    private load: LoadingController,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        rankType: ['MMR', Validators.required],
        discord: [''],
        type: [false]
      }
    );

  }
  async enviar() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    await this.presentLoading(this.registerForm.value.name);
    const type = (this.registerForm.value.type) ? 'academy' : 'friends';
    if (await this.communityService.communityExists(this.registerForm.value.name)) {
      this.presentToast(`El nombre ${this.registerForm.value.name} ya esta en uso intente con otro`, 'danger', 'close-circle-outline');
    } else {
      const community: community = await this.communityService.addCommunity({
        name: this.registerForm.value.name,
        type: type,
        admin: this.sesion.infinity.roninAddress,
        discord: this.registerForm.value.discord,
        rankType: this.registerForm.value.rankType
      });
      if (community) {
        this.sesion.communities = [community];
        this.sesion.setCommunitiesOnCache(this.sesion.communities);
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
        this.presentToast(`${this.registerForm.value.name} ha sido creado`, 'primary', 'checkmark-outline');
      } else {
        this.presentToast(`Error al crear ${this.registerForm.value.name} por favor intene mas tarde`, 'danger', 'close-circle-outline');
      }
    }    
    this.loading.dismiss();
  }
  async presentLoading(name) {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Creando ' + name
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
  
}
