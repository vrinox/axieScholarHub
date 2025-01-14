import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDoc, getDocs, query, updateDoc, where } from '@firebase/firestore';
import { Observable, from } from 'rxjs';
import { Axie } from '../models/axie';
import { userLink, userList } from '../models/interfaces';
import { Scholar } from '../models/scholar';

@Injectable({
  providedIn: 'root'
})
export class ApiTrackerService {

  constructor(
    public http: HttpClient,
    private db: Firestore
  ) { }

  async nameExists(name) {
    const scholar = await this.getScholar('name',name);
    return scholar !== null;
  }
  async updateScholar(roninAddress: string, form:{
    name: any,
    ganancia: any
  }){
    const querySnapshot = await getDocs(query(collection(this.db, "scholars"), where('roninAddress', "==", roninAddress)));
    const dbScholar = (querySnapshot.docs[0])? querySnapshot.docs[0]: null;
    if(dbScholar){     
      await updateDoc(dbScholar.ref, form);    
      const docSnap = await getDoc(dbScholar.ref);
      return  new Scholar(docSnap.data());
    }else{
      return null
    }
  }
  async addUserLink(userLinkData: userLink): Promise<string>{
    const dbRef = await addDoc(collection(this.db,"userLink"), userLinkData);
    const doc = await getDoc(dbRef);
    return doc.data().uid;
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
    return (!dbScholar)? null : new Scholar(dbScholar);
  }
  async addScholar(scholar: Scholar){
    const dbRef = await addDoc(collection(this.db,"scholars"), scholar.getValues());
    const doc = await getDoc(dbRef);
    return doc.id;
  };
  getUser(partialName):Observable<any>{
    return from(getDocs(query(collection(this.db, "scholars"), where('name', '>=', partialName), where('name', '<=', partialName+ '\uf8ff'))));
  }
  private async getAxieAvatar(roninAddress: string):Promise<Axie>{
    const axie = new Axie();
    const userLink = await this.getUserLink('roninAddress', roninAddress);
    axie.id = (userLink)?userLink.avatar.split('/')[5] : "";
    return axie;
  }
  async createItemList(scholar:Scholar):Promise<userList>{
    const axie = await this.getAxieAvatar(scholar.roninAddress);
      return {
        scholar: scholar,
        axie: axie
      }
  }
}
