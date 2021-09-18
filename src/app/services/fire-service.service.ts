import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { getDoc, query, where } from '@firebase/firestore';
import { userLink } from '../models/interfaces';
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
  async getUserLink(roninAddress: string): Promise<userLink> {
    const querySnapshot = await getDocs(query(collection(this.db, "userLink"), where("roninAddress", "==", roninAddress)));
    const dbUserLink = (querySnapshot.docs[0])? querySnapshot.docs[0].data(): null;
    
    return (!dbUserLink)? null : {
      avatar: dbUserLink.avatar,
      roninAddress: dbUserLink.roninAddress,
      uid: dbUserLink.uid
    }
  }
}
