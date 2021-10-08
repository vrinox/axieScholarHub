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
      const axieFullData = axiesFullData.find((atAxie:atAxieData)=>{
        return axie.id == atAxie.id
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

  public async assembleBattle(battle: Battle, ronninAddress: string){
    const axies = await this.getAxiesForBattle(battle);
    ronninAddress = this.parseRonin(ronninAddress);
    let enemyRoninAddress: string;
    let myTeamId: string;
    if(battle.first_client_id === ronninAddress){
      enemyRoninAddress = battle.second_client_id;
      myTeamId = battle.first_team_id;
    } else {
      enemyRoninAddress = battle.first_client_id;
      myTeamId = battle.second_team_id
    }
    const enemy: scholarOfficialData = await this.getAllAccountData(enemyRoninAddress);
    battle.enemyName = enemy.name;
    axies.forEach((axie:Axie)=>{
      if(axie.teamId === myTeamId){
        battle.firstTeam.push(axie);
      } else if (axie.teamId !== myTeamId) {
        battle.secondTeam.push(axie);
        battle.winner = (battle.winner)? 0 : 1;
      }
    });
    return battle;
  }
  async getAxiesForBattle(battle: Battle){
    const axies: Axie[] = await Promise.all(battle.fighters.map((rawAxie)=>{
      return this.getAxieData(rawAxie.fighter_id.toString()).then(( axie:atAxieData )=> {
        const newAxie = new Axie(axie);
        newAxie.teamId = rawAxie.team_id;
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
  public async getScholarsAPIData(scholar: Scholar[]): Promise<any>{
    return new Promise((resolve)=>{
      let multiRoning: String = this.setRoningAdress(scholar);
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
