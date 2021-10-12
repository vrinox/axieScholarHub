import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { addDoc, orderBy, query, QueryDocumentSnapshot, updateDoc, where } from '@firebase/firestore';
import { Axie } from '../models/axie';
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
    console.log(rawBattle);
    const dbRef = await addDoc(collection(this.db,"sharedBattles"), rawBattle);
    return dbRef.id;
  }

  async getScholars() {
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc) => {
      return new Scholar(doc.data());
    });
  }
  async getScholarsByAddressList(membersAddressList: string[]):Promise<Scholar[]>{
    let batches = [];
    while (membersAddressList.length) {      
      const batch = membersAddressList.splice(0, 10);
      batches.push(
        new Promise(response => {
          getDocs(query(collection(this.db, 'scholars'),where('roninAddress', 'in', batch)))
            .then(results => response(results.docs.map(result => ({ ...result.data()}) )))
        })
      )
    }
    let scholars = await Promise.all(batches).then(content => {
      const all = []
      content.forEach((rawScholars) => {
        rawScholars.forEach((raw)=>{
          all.push(new Scholar(raw))
        })
      });
      return all;
    })
    return scholars;
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
  async updateAvatar(axie: Axie, uid:string):Promise<any>{
    const querySnapshot = await getDocs(query(collection(this.db, "userLink"), where('uid', "==", uid)));
    const dbUserLink = (querySnapshot.docs[0])? querySnapshot.docs[0]: null;
    await updateDoc(dbUserLink.ref, {
      avatar: axie.image
    });
    return dbUserLink.id;
  }
}
