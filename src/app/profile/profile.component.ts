import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {Firestore, collection, getDocs} from '@angular/fire/firestore';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public db: Firestore,
    private sesion: SesionService
  ) { }

  ngOnInit() {
    this.getData().then((data)=>{
      console.log(data);
    });
  }
  async getData() {
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc)=>{
      return doc.data();
    });
  }

  signOut() {
    this.authService.logout();
  }
}