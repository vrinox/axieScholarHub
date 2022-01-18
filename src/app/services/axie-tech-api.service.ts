import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Axie } from '../models/axie';
import { Battle } from '../models/battle';
import { atAbility, atAxieData, atPart, scholarOfficialData } from '../models/interfaces';
import { Scholar } from '../models/scholar';

@Injectable({
  providedIn: 'root'
})
export class AxieTechApiService {
  private REST_API_SERVER = 'https://game-api.axie.technology';
  private AXIE_DATA_SERVER = 'https://api.axie.technology';
  private axieCache: atAxieData[] = [];

  constructor(private httpClient: HttpClient) { }

  public getAllAccountData(roninAddress: string):Promise<scholarOfficialData>{    
    return this.httpClient
      .get(`${this.REST_API_SERVER}/api/v1/${roninAddress}`)
      .toPromise()
      .then((statsData:scholarOfficialData)=>{
        return statsData;
      })
  }
  public async getBattleLog(roninAddress:string):Promise<Battle[]>{
    return this.httpClient
    .get(`${this.REST_API_SERVER}/logs/pvp/${roninAddress}`)
    .toPromise()
    .then((battlesData:any)=>{
      if(battlesData.battles.length > 0){
        return battlesData.battles.map((battle)=>{
          let battleObjc = new Battle();
          battleObjc.parseNewBattle(battle); 
          return battleObjc;
        });
      }else{
        return [];
      }
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
      const axieFullData = axiesFullData.find((atAxie:atAxieData)=>{
        return axie.id == atAxie.id
      });
      axie = this.buildAxieData(axie, axieFullData);
    })
  }
  public buildAxieData(axie: Axie, axieFullData: atAxieData){
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
    return axie;
  }
  public getAxieData(axieId:string):Promise<atAxieData>{
    let axieCached = this.axieCache.find((axie) => {
      return axie.id === axieId
    })
    if(axieCached){
      return Promise.resolve(axieCached);
    } 
    return this.httpClient
      .get(`${this.AXIE_DATA_SERVER}/getgenes/${axieId}/all`)
      .toPromise()
      .then((statsData:atAxieData)=>{
        this.axieCache.push(statsData);
        return statsData;
      })
  };

  public async assembleBattle(battle: Battle, ronninAddress: string){
    const newBattle = new Battle(battle.getSharedValues());
    if(newBattle.first_client_id === ronninAddress){
      newBattle.firstTeam = await this.getAxiesForBattle(newBattle.first_team_fighters);
      newBattle.secondTeam = await this.getAxiesForBattle(newBattle.second_team_fighters);
    } else {
      newBattle.firstTeam = await this.getAxiesForBattle(newBattle.second_team_fighters);
      newBattle.secondTeam = await this.getAxiesForBattle(newBattle.first_team_fighters);
    }
    const enemyRoninAddress = this.getEnemyRonin(newBattle, ronninAddress);
    const enemy: scholarOfficialData = await this.getAllAccountData(enemyRoninAddress);
    newBattle.win = newBattle.winner === ronninAddress;
    newBattle.enemyName = enemy.name;
    return newBattle;
  }
  public assembleBattleMin(battle: Battle, roninAddress: string, sharedData: any = {}){
    const newBattle = new Battle(battle.getSharedValues(sharedData));
    roninAddress = this.parseRonin(roninAddress);
    newBattle.win = newBattle.winner === roninAddress;
    return newBattle;
  }
  public getEnemyRonin(battle: Battle, roninAddress:string){
    return (battle.first_client_id === roninAddress) ? battle.second_client_id: battle.first_client_id;
  }
  async getAxiesForBattle(fighters: any[]){
    const axies: Axie[] = await Promise.all(
      fighters.map((rawAxie:number)=>{
      return this.getAxieData(rawAxie.toString()).then(( axie:atAxieData )=> {
        const newAxie = new Axie(axie);
        return newAxie;
      });
    }));
    return axies;
  }
  parseRonin(roninAddress: string){
    if(roninAddress.search('ronin') !== -1){
      roninAddress = "0x"+roninAddress.split(':')[1];
    }
    return roninAddress;
  }
  public async getScholarsAPIData(scholars: Scholar[]): Promise<any>{
    return new Promise((resolve)=>{
      let multiRoning: String = this.setRoningAdress(scholars);
      this.httpClient.get(`${this.REST_API_SERVER}${multiRoning}`)
      .subscribe(res=>{
        let axiesUserData: scholarOfficialData[] =  this.parserJson(res);
        resolve(axiesUserData);
      });
    });
  }

  private setRoningAdress(scholar: Scholar[]){
    let multiRoning: String = '/api/v1/';
    let longArray: number = scholar.length - 1;
    scholar.forEach((element, index) => {
      if(longArray != index){
        multiRoning += `${element.roninAddress},`;
      }else{
        multiRoning += `${element.roninAddress}`;
      }
    });
    return multiRoning;
  }

  private parserJson(newDataScholar: object){
    let scholarData: any = Object.entries(newDataScholar)
    .map((scholarData: scholarOfficialData[])=>{
      return this.parseData(scholarData);
    });
    return scholarData;
  }

  private parseData(axiesUserData: scholarOfficialData[]){
    return {
      ronin_address: axiesUserData[0],
      ronin_slp: axiesUserData[1].ronin_slp!,
      total_slp: axiesUserData[1].total_slp!,
      in_game_slp: axiesUserData[1].in_game_slp!,
      rank: axiesUserData[1].rank!,
      mmr: axiesUserData[1].mmr!,
      total_matches: axiesUserData[1].total_matches!,
      ign: axiesUserData[1].name!
    }
  }
}
