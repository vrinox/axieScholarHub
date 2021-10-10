import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, getDocs, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import { friendRequest, userList } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(
    private db: Firestore
  ) { }

  async getFriendRequest(roninAddress: string): Promise<friendRequest[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "friendRequest"), where('to', "==", roninAddress)));
    const requestList = querySnapshot.docs.map((doc:QueryDocumentSnapshot)=>{
      const data = doc.data();
      return {
        from: data.from,
        to: data.to,
        id: doc.id,
        fromName: data.fromName
      }
    })
    return requestList;
  }
  async getFriendsAddressList(roninAddress: string):Promise<string[]>{
    const [requested, whoRequests] = await Promise.all(
      [
        getDocs(query(collection(this.db, "friends"), where('requested', "==", roninAddress))),
        getDocs(query(collection(this.db, "friends"), where('whoRequests', "==", roninAddress)))
      ]
    )
    const friendsAddressList = [...requested.docs, ...whoRequests.docs].map((doc:QueryDocumentSnapshot)=>{
      const data = doc.data();
      return (data.whoRequests === roninAddress) ? data.requested : data.whoRequests;
    });
    return friendsAddressList;
  }
  async createRequest(from: string, fromName: string, to: string){
    const dbRef = await addDoc(collection(this.db,"friendRequest"), {
      "from": from,
      "fromName": fromName,
      "to": to 
    });
    const doc = await getDoc(dbRef);
    return doc.id;
  }
  async acceptRequest(solicitud: friendRequest){
    const dbRef = await addDoc(collection(this.db,"friends"), {
      "whoRequests": solicitud.from,
      "requested": solicitud.to 
    });
    const docSnap = await getDoc(dbRef);    
    await deleteDoc(doc(this.db, "friendRequest", solicitud.id));
    return docSnap.id;
  }
  async rejectFriendRequest(solicitud: friendRequest){
    await deleteDoc(doc(this.db, "friends", solicitud.id));
  }
}
