import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { userCloudData } from '../models/interfaces';

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

  public async getAxies(){
    return await this.get('axies');
  }

  public setAxies(axies: any){
    this.set('axies', axies);
  }

  public async getBattles(){
    return await this.get('battles');
  }

  public setBattles(battles: any){
    this.set('battles', battles);
  }

  private set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  private async get(key: string) {
    return await this._storage?.get(key);
  }

}
