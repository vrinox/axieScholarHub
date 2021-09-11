import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {GoogleAuthProvider} from 'firebase/auth'
import * as authref from '@angular/fire/auth';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup} from '@angular/fire/auth';

@Injectable()
export class AuthService {

  constructor(
    private afAuth: Auth,
    private router: Router) {
    }
    
  login(email: string, password: string) {
    signInWithEmailAndPassword(this.afAuth, email, password)
    .then(value => {
      console.log('Nice, it worked!');
      this.router.navigateByUrl('/profile');
    })
    .catch(err => {
      console.log('Something went wrong: ', err.message);
    });
  }

  emailSignup(email: string, password: string) {
    createUserWithEmailAndPassword(this.afAuth, email, password)
    .then(value => {
     console.log('Sucess', value);
     this.router.navigateByUrl('/profile');
    })
    .catch(error => {
      console.log('Something went wrong: ', error);
    });
  }

  googleLogin() {
    const provider = new GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(value => {
     console.log('Sucess', value),
     this.router.navigateByUrl('/profile');
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