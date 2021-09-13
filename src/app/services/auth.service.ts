import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth'
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Injectable()
export class AuthService {

  constructor(
    private afAuth: Auth,
    private router: Router,
    private toastController: ToastController) {
  }

  login(formValues: { email: string, password: string }) {
    signInWithEmailAndPassword(this.afAuth, formValues.email, formValues.password)
      .then(value => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('/tabs');
      })
      .catch(async err => {
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
  }

  emailSignup(form: { email: string, password: string, roninAddress: string, avatar: string }) {
    createUserWithEmailAndPassword(this.afAuth, form.email, form.password)
      .then((value) => {
        const userLinkRequestBody: any = {
          uid: value.user.uid,
          avatar: form.avatar,
          roninAddress: form.roninAddress
        }
        console.group(userLinkRequestBody);
        this.router.navigateByUrl('/tabs');
      })
      .catch(async error => {
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
      this.router.navigate(['/']);
    });
  }

  private oAuthLogin(provider) {
    return signInWithPopup(this.afAuth, provider);
  }
  getUserData() {
    return this.afAuth.currentUser;
  }
}