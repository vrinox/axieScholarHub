import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userLink } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiTrackerService {
  private urlApiDb = 'https://us-central1-axieacademytracker.cloudfunctions.net';

  constructor(
    public http: HttpClient
  ) { }

  
  addUserLink(userLinkData: userLink): Promise<string>{
    return new Promise((resolve,reject)=>{
      this.http.post(`${this.urlApiDb}/addUserLink`, userLinkData ).subscribe((res: any)=>{
        resolve(res.userLinkId);
      });
    })
  }
  getUserData(uid:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.post(`${this.urlApiDb}/getAppUserData`, {"uid": uid} ).subscribe((res: any)=>{
        resolve(res.userData);
      });
    })
  }
  
}
