import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';
import { userLink } from '../models/interfaces';
import { Scholar } from '../models/scholar';

@Injectable({
  providedIn: 'root'
})
export class ApiTrackerService {

  constructor(
    public http: HttpClient,
    private db: Firestore
  ) { }

  
  async addUserLink(userLinkData: userLink): Promise<string>{
    const dbRef = await addDoc(collection(this.db,"userLink"), userLinkData);
    return dbRef.id;
  }
  async getUserData(uid:string):Promise<any>{
    const userLinkData: userLink = await this.getUserLink('uid', uid);
    const scholar: Scholar = await this.getScholar('roninAddress', userLinkData.roninAddress);
    return {
      userData: userLinkData,
      scholar: scholar.getValues(),
    };
  }
  async getUserLink(field: string, value: string): Promise<userLink> {
    const querySnapshot = await getDocs(query(collection(this.db, "userLink"), where(field, "==", value)));
    const dbUserLink = (querySnapshot.docs[0])? querySnapshot.docs[0].data(): null;
    
    return (!dbUserLink)? null : {
      avatar: dbUserLink.avatar,
      roninAddress: dbUserLink.roninAddress,
      uid: dbUserLink.uid
    }
  }
  async getScholar(field: string, value: string): Promise<Scholar> {
    const querySnapshot = await getDocs(query(collection(this.db, "scholars"), where(field, "==", value)));
    const dbScholar = (querySnapshot.docs[0])? querySnapshot.docs[0].data(): null;
    console.log('scholar', field, value);
    return (!dbScholar)? null : new Scholar(dbScholar);
  }
}
