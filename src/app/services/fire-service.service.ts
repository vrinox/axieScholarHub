import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { addDoc } from '@firebase/firestore';
import { Battle } from '../models/battle';
import {  sharedData } from '../models/interfaces';
import { Scholar } from '../models/scholar';


@Injectable({
  providedIn: 'root'
})
export class FireServiceService {
  constructor(
    public db: Firestore
  ) {

  }

  async shareReplay(battle: Battle, sharedData:sharedData){
    const dbRef = await addDoc(collection(this.db,"sharedBattles"), battle.getSharedValues(sharedData));
    return dbRef.id;
  }

  async getScholars() {
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc) => {
      return new Scholar(doc.data());
    });
  }
  async getSharedBattles():Promise<Battle[]>{
    const querySnapshot = await getDocs(collection(this.db, 'sharedBattles'))
    return querySnapshot.docs.map((doc) => {
      return new Battle(doc.data());
    });
  }
}
