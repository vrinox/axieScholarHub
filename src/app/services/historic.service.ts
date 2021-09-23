import { Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { getDocs, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import { Scholar } from '../models/scholar';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {
  
  constructor(
    private db: Firestore,
  ) { }

  
  async getHistoric(roninAddress:string) {
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('roninAddress', "==", roninAddress)));
    const story = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }
  async getHistoricByDate(yesterday):Promise<Scholar[]>{
    const querySnapshot = await getDocs(query(collection(this.db, "historic"), where('lastUpdate', "==", yesterday)));
    const story = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const rawScholar = doc.data();
      rawScholar.lastUpdate = rawScholar.lastUpdate.toDate();
      return new Scholar(rawScholar);
    })
    return story;
  }
}
