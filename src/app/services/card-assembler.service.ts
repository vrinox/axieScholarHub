import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Part } from '../models/part';
import { StorageService } from './storage.service';
const BASE_RUL_CARD_ABILITIES="https://storage.googleapis.com/axie-cdn/game/cards/card-abilities.json";
@Injectable({
  providedIn: 'root'
})
export class CardAssemblerService {
  cardAbilitiesDataBase: Part[] = []; 
  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { 
    
  }
  public init(){
    this.getDataBase();
  }
  private async getDataBase() {
    let rawDatabase = await this.storage.getCardDatabase();
    if(!rawDatabase) {
      rawDatabase= await this.http.get(BASE_RUL_CARD_ABILITIES).toPromise();
      this.storage.setCardDatabase(rawDatabase);
    }
    this.cardAbilitiesDataBase = Array.from(rawDatabase).map((rawPart)=>{
      return new Part(rawPart);
    });
  };
  public async getCardRefById(id:string){
    const oldPart: Part = this.cardAbilitiesDataBase.find((dbPart:Part) =>{
      return dbPart.id === id;
    });
    return new Part(oldPart.getValues());
  } 
}
