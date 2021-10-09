import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayUnion, collection, DocumentReference, getDoc, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from '@firebase/firestore';
import { Observable, from } from 'rxjs';
import { community, communityPost } from '../models/interfaces';
import { Scholar } from '../models/scholar';

@Injectable({
  providedIn: 'root'
})
export class ComunityService {
  activeCommunity: community;
  constructor(
    public db: Firestore
  ) { }

  async addScholarToComunity(roninAddress, comunityId) {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('roninAddress', "==", roninAddress)));
    const docRef: DocumentReference = querySnapshot.docs[0].ref;
    if (docRef) {
      await updateDoc(docRef, {
        communities: arrayUnion(comunityId)
      })
    } else {
      await addDoc(collection(this.db, "scholar-communities"), {
        roninAddress: roninAddress,
        communities: [comunityId]
      });
    }
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
  async getCommunityAllData(id: string): Promise<community> {
    const docRef = doc(this.db, 'communities', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name,
        type: data.type,
        id: docSnap.id,
        rankType: data.rankType
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
  async getFeed(communityId:string){
    const querySnapshot = await getDocs(query(collection(this.db, "community-post"), where('communityId', "==", communityId)));
    const feed = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      return doc.data();
    })
    return feed;
  }
}
