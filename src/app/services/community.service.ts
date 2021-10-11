import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayUnion, collection, deleteDoc, DocumentReference, getDoc, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from '@firebase/firestore';
import { Observable, from } from 'rxjs';
import { Battle } from '../models/battle';
import { community, communityPost, communityRequest } from '../models/interfaces';
import { AxieTechApiService } from './axie-tech-api.service';

@Injectable({
  providedIn: 'root'
})
export class ComunityService {
  activeCommunity: community;
  constructor(
    private db: Firestore,
    private axieTechService: AxieTechApiService
  ) { }

  async addScholarToComunity(roninAddress, comunityId) {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('community', "==", comunityId)));
    const docRef: DocumentReference = querySnapshot.docs[0].ref;
    if (docRef) {
      await updateDoc(docRef, {
        members: arrayUnion(roninAddress)
      })
    }
    return docRef.id
  }
  async addCommunity(form:{
    name: string,
    admin: string,
    discord: string,
    type: string,
    rankType: string
  }) {
    const newCommunity: any = form;
    const docRef: DocumentReference = await addDoc(collection(this.db, "communities"), newCommunity);
    await addDoc(collection(this.db, "scholar-communities"), {
      members: [form.admin],
      community: docRef.id
    });
    newCommunity.id = docRef.id;
    return newCommunity;
  }
  async communityExists(name) {
    const querySnapshot = await this.getCommunitiesByName(name).toPromise();
    return !!querySnapshot.docs[0];
  }
  async getCommunities(roninAddress: string) {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('members', "array-contains", roninAddress)));
    const communities = await Promise.all(querySnapshot.docs.map(async (doc) => {
      return this.getCommunityAllData(doc.data().community);
    }));
    return communities || [];
  }
  getCommunitiesByName(partialName: string): Observable<any> {
    return from(getDocs(query(collection(this.db, "communities"), where('name', '==', partialName))));
  }
  getCommunitiesByPartialName(partialName:string): Observable<any>{
    return from(getDocs(query(collection(this.db, "communities"), where('name', '>=', partialName), where('name', '<=', partialName+ '\uf8ff'))));
  }
  async getCommunityAllData(id: string): Promise<community> {
    const docRef = doc(this.db, 'communities', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name,
        type: data.type,
        id: docSnap.id,
        rankType: data.rankType,
        admin: data.admin
      };
    } else {
      return null;
    }
  }
  async getMembersAddressList(communityId: string): Promise<string[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('community', "==", communityId)));
    const docRef = querySnapshot.docs[0];
    if (docRef) {
      return docRef.data().members;
    } else {
      return [];
    }
  }
  async addCommunityPost(msg: communityPost){
    const docRef: DocumentReference = await addDoc(collection(this.db, "community-post"),msg);
    return docRef.id;
  }
  async getFeed(communityId:string, members: string[]){
    const querySnapshot = await getDocs(query(collection(this.db, "community-post"), where('communityId', "==", communityId)));
    let feed = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      return doc.data();
    })
    const querySnapshotSharedBattle = await getDocs(query(collection(this.db, "sharedBattles")));
    const shared = querySnapshotSharedBattle.docs.map((doc:QueryDocumentSnapshot)=>{
      return doc.data();
    }).filter((data)=>{
      return members.includes(data.shared.scholar.roninAddress);
    }).map((battle)=>{
      let newBattle = new Battle(battle);
      newBattle = this.axieTechService.assembleBattleMin(newBattle, battle.shared.scholar.roninAddress, battle.shared);
      newBattle.creationDate = battle.creationDate;
      return newBattle;
    })
    feed = [...feed, ...shared].sort((a, b)=>{
      return b.creationDate.toDate().getTime() - a.creationDate.toDate().getTime();
    })
    return feed;
  }
  async createCommunityRequest(from: string, fromName: string, communityId: string){
    const reqDoc = await this.getRequest(from, communityId)
    if(reqDoc){
      return reqDoc.id;
    } else{
      const dbRef = await addDoc(collection(this.db,"community-request"), {
        "from": from,
        "fromName": fromName,
        "communityId": communityId 
      });
      const doc = await getDoc(dbRef);
      return doc.id;
    }
  }
  async getRequest(from: string, communityId: string){
    const querySnapshot = await getDocs(query(collection(this.db, "community-request"), where('from', '==', from),where('communityId', '==', communityId)))
    return querySnapshot.docs[0];
  }
  async acceptRequest(solicitud: communityRequest){
    const docId = await this.addScholarToComunity(solicitud.from, solicitud.communityId);
    await deleteDoc(doc(this.db, "community-request", solicitud.id));
    return docId;
  }
  async rejectRequest(solicitud: communityRequest){
    await deleteDoc(doc(this.db, "community-request", solicitud.id));
  }
  async getRequests(communityId: string): Promise<communityRequest[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "community-request"), where('communityId', "==", communityId)));
    const requestList = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const data = doc.data();
      return {
        from: data.from,
        communityId: data.communityId,
        id: doc.id,
        fromName: data.fromName
      }
    })
    return requestList;
  }
}
