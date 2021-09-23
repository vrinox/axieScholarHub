import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth'
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from '@angular/fire/auth';
import { LoadingController, ToastController } from '@ionic/angular';
import { SesionService } from './sesion.service';

@Injectable()
export class AuthService {
  loading: HTMLIonLoadingElement
  constructor(
    private afAuth: Auth,
    private router: Router,
    private toastController: ToastController,
    private sesion: SesionService,
    private load: LoadingController) {
  }

  async login(formValues: { email: string, password: string }) {
    await this.presentLoading();
    return new Promise((resolve, reject)=>{
      signInWithEmailAndPassword(this.afAuth, formValues.email, formValues.password)
      .then(value => {
        this.loading.dismiss();
        this.router.navigate(['start-page'],{replaceUrl: true});
        resolve(value.user.uid);
      })
      .catch(async err => {
        this.loading.dismiss()
        const toast = await this.toastController.create({
          message: 'wrong Email/Password ',
          duration: 2000,
          position: 'top',
          color: "danger",
          buttons: [
            {
              side: 'end',
              icon: 'alert-circle-outline'
            }
          ]
        });
        toast.present();
      });
    })
  }

  loginComplete(uid: string) {
    this.sesion.sesionInit(uid, 'login');
  }
  async emailSignup(form: { email: string, password: string, roninAddress: string, avatar: string }):Promise<any> {
    await this.presentLoading();
    return new Promise((resolve, reject)=>{
      createUserWithEmailAndPassword(this.afAuth, form.email, form.password)
      .then((value) => {
        this.loading.dismiss();
        this.router.navigate(['start-page'], {replaceUrl: true});
        resolve({
          uid: value.user.uid,
          avatar: form.avatar,
          roninAddress: this.parseRonin(form.roninAddress)
        });
      })
      .catch(async error => {
        this.loading.dismiss();
        const toast = await this.toastController.create({
          message: error.message,
          duration: 2000,
          position: 'top',
          color: "danger",
          buttons: [
            {
              side: 'end',
              icon: 'alert-circle-outline'
            }
          ]
        });
        toast.present();
        reject()
      });
    });
  }

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(value => {
        console.log('Sucess', value),
          this.router.navigateByUrl('/tabs',{ replaceUrl: true});
      })
      .catch(error => {
        console.log('Something went wrong: ', error);
      });
  }

  logout() {
    signOut(this.afAuth).then(() => {
      this.sesion.close();
    });
  }

  private oAuthLogin(provider) {
    return signInWithPopup(this.afAuth, provider);
  }
  getUserData() {
    return this.afAuth.currentUser;
  }
  async presentLoading() {
    this.loading = await this.load.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }
  parseRonin(roninAddress: string){
    if(roninAddress && roninAddress.search('ronin') !== -1){
      roninAddress = "0x"+roninAddress.split(':')[1];
    }
    return roninAddress;
  }
}