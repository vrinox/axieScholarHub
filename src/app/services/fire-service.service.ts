import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { addDoc, orderBy, query } from '@firebase/firestore';
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
    const rawBattle: any = battle.getSharedValues(sharedData);
    rawBattle.creationDate = new Date();
    const dbRef = await addDoc(collection(this.db,"sharedBattles"), rawBattle);
    return dbRef.id;
  }

  async getScholars() {
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc) => {
      return new Scholar(doc.data());
    });
  }
  async getSharedBattles():Promise<Battle[]>{
    const querySnapshot = await getDocs(query(collection(this.db, 'sharedBattles'),orderBy('creationDate','desc')));
    return querySnapshot.docs.map((doc) => {
      return new Battle(doc.data());
    });
  }
}
