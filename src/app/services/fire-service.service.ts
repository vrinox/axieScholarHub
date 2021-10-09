import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { addDoc, orderBy, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import { Battle } from '../models/battle';
import { scholarOfficialData, sharedData } from '../models/interfaces';
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
  async getScholarsByAddressList(membersAddressList: string[]) {
    const querySnapshot = await getDocs(query(collection(this.db, 'scholar'),where('roninAddress', 'in', membersAddressList)))
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
  async getApp(){
    const querySnapshot = await getDocs(collection(this.db, 'app'));
    return querySnapshot.docs[0].data()
  }
  async addScholar(scholarData:scholarOfficialData) {
    const scholar = new Scholar(scholarData);
    const dbRef = await addDoc(collection(this.db,"scholar"), scholar);
    return dbRef.id;
  }
  async updateAvatar():Promise<any>{
    
  }
}
