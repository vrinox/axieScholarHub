import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Axie } from '../models/axie';
import { atAbility, atAxieData, atPart, scholarOfficialData } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AxieTechApiService {
  private REST_API_SERVER = 'https://game-api.axie.technology';
  private AXIE_DATA_SERVER = 'https://api.axie.technology';

  constructor(private httpClient: HttpClient) { }

  public getAllAccountData(roninAddress: string):Promise<scholarOfficialData>{    
    return this.httpClient
      .get(`${this.REST_API_SERVER}/api/v1/${roninAddress}`)
      .toPromise()
      .then((statsData:scholarOfficialData)=>{
        return statsData;
      })
  }
  public async getAccountData(roninAddress: string):Promise<scholarOfficialData> {
    return await this.getAllAccountData(roninAddress);
  }
  public async getAxiesAllData(axies:Axie[]) {
    const axiesFullData = await Promise.all(axies.map((axie:Axie)=>{
      return this.getAxieData(axie.id);
    }));
    axies.forEach((axie:Axie)=>{
      const axieFullData =axiesFullData.find((atAxie:atAxieData)=>{
        axie.id == atAxie.id
      });
      axie.abilities = axieFullData.parts.map((part:atPart)=>{
        if(part.abilities.length !== 0){
          return part.abilities[0];
        }else {
          return null
        }
      }).filter((ability:atAbility)=>{
        return ability != null
      })
      axie.stats = axieFullData.stats;
      axie.traits = axieFullData.traits;
    })
  }
  public getAxieData(axieId:string):Promise<atAxieData>{
    return this.httpClient
      .get(`${this.AXIE_DATA_SERVER}/getgenes/${axieId}/all`)
      .toPromise()
      .then((statsData:atAxieData)=>{
        return statsData;
      })
  };

}
