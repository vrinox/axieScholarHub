import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { userCloudData } from '../models/interfaces';
import { Part } from '../models/part';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) { 
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public setUser(userData: userCloudData) {
    this.set('user', userData)
  }

  public async getUser():Promise<userCloudData> {
    return await this.get('user');
  }

  public async clear() {
    await this.storage.clear();
  }

  public async getCardDatabase(){
    return await this.get('cardDatabase');
  }

  public setCardDatabase(cardDatabase: Part[]){
    this.set('cardDatabase', cardDatabase.map((part:Part)=>{
      return part.getValues();
    }))
  }

  private set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  private async get(key: string) {
    return await this._storage?.get(key);
  }

}
