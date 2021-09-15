import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth'
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { userCloudData } from '../models/interfaces';
import { SesionService } from './sesion.service';

@Injectable()
export class AuthService {

  constructor(
    private afAuth: Auth,
    private router: Router,
    private toastController: ToastController,
    private sesion: SesionService) {
  }

  login(formValues: { email: string, password: string }) {
    this.router.navigate(['start-page']);
    return new Promise((resolve, reject)=>{
      signInWithEmailAndPassword(this.afAuth, formValues.email, formValues.password)
      .then(value => {
        resolve(value.user.uid);
      })
      .catch(async err => {
        this.router.navigate['email-login']
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
  emailSignup(form: { email: string, password: string, roninAddress: string, avatar: string }):Promise<any> {
    this.router.navigate(['start-page']);
    return new Promise((resolve, reject)=>{
      createUserWithEmailAndPassword(this.afAuth, form.email, form.password)
      .then((value) => {
        resolve({
          uid: value.user.uid,
          avatar: form.avatar,
          roninAddress: form.roninAddress
        });
      })
      .catch(async error => {
        this.router.navigate(['email-login']);
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
          this.router.navigateByUrl('/tabs');
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
}