import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Scholar } from '../models/scholar';


@Injectable({
  providedIn: 'root'
})
export class FireServiceService {
  constructor(
    public db: Firestore
  ) {

  }

  async getScholars() {
    const querySnapshot = await getDocs(collection(this.db, 'scholars'))
    return querySnapshot.docs.map((doc) => {
      return new Scholar(doc.data());
    });
  }
  
}
