import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayUnion, collection, DocumentReference, getDoc, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ComunityService {

  constructor(
    public db: Firestore
  ) { }
  
  async addScholarToComunity(roninAddress, comunityId){
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('roninAddress', "==", roninAddress)));
    const docRef: DocumentReference = querySnapshot.docs[0].ref;
    if(docRef){
      await updateDoc(docRef, {
        communities: arrayUnion(comunityId)
      })
    } else {
      await addDoc(collection(this.db,"scholar-communities"), {
        roninAddress: roninAddress,
        communities: [comunityId]
      });
    }
  }
  async addComunity(name:string, roninAddress:string){
    const docRef: DocumentReference = await addDoc(collection(this.db,"scholar-communities"), {
      name: name
    });
    await addDoc(collection(this.db,"scholar-communities"), {
      roninAddress: roninAddress,
      communities: [docRef.id]
    });
  }
  async getCommunities(roninAddress: string){
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('roninAddress', "==", roninAddress)));
    console.log('getComuniities',roninAddress,querySnapshot.docs);
    const docRef = querySnapshot.docs[0];
    if(docRef){
      const comunityList = docRef.data();
      const communities = await Promise.all( comunityList.communities.map((commnunityId)=>{
        return this.getCommunityAllData(commnunityId);
      }))
      return communities;
    }else{
      return []
    }
    
  }
  async getCommunityAllData(id: string ){
    const docRef = doc(this.db, 'communities',  id);
    const docSnap = await  getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }
}
