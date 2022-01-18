import { Axie } from "./axie";
import { newBattelFormat } from "./interfaces";

export class Battle {
  myName?: string = "";
  enemyName?: string = "";
  battle_type: number = 0;
  battle_uuid: string = "";
  created_at?: Date;
  first_client_id: string = "";
  first_team_id: string = "";
  id: string = "";
  replay: string = "";
  second_client_id: string = "";
  second_team_id: string = "";
  winner: string;
  firstTeam: Axie[] = [];
  secondTeam: Axie[] = [];
  shared?: any;
  win?: boolean = false;
  creationDate?: any;  
  second_team_fighters: any;
  first_team_fighters: any;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
  getValues() {
    return {
      battle_type: this.battle_type,
      battle_uuid: this.battle_uuid,
      created_at: this.created_at,
      first_client_id: this.first_client_id,
      first_team_id: this.first_team_id,
      id: this.id,
      replay: this.replay,
      second_client_id: this.second_client_id,
      second_team_id: this.second_team_id,
      winner: this.winner,    
      second_team_fighters: this.second_team_fighters,
      first_team_fighters: this.first_team_fighters
    }
  }
  parseNewBattle(battle:newBattelFormat){
    this.battle_uuid = battle.battle_uuid;
    this.created_at = new Date(battle.game_started);
    this.first_client_id = battle.first_client_id;
    this.first_team_id = battle.first_team_id;
    this.second_client_id = battle.second_client_id;
    this.second_team_id = battle.second_team_id;
    this.replay = `https://cdn.axieinfinity.com/game/deeplink.html?f=rpl&q=${battle.battle_uuid}`;
    this.winner = battle.winner;
    this.second_team_fighters = battle.second_team_fighters;
    this.first_team_fighters = battle.first_team_fighters;
  }
  getSharedValues(sharedData?){
    let firstTeam, secondTeam;
    if(this.firstTeam[0] && this.firstTeam[0] instanceof Axie){
      firstTeam = this.firstTeam.map( axie => axie.getValuesMin());
      secondTeam = this.secondTeam.map( axie => axie.getValuesMin());
    } else {
      firstTeam = this.firstTeam;
      secondTeam = this.secondTeam;
    }
    return {
      battle_type: this.battle_type,
      battle_uuid: this.battle_uuid,
      created_at: this.created_at,
      first_client_id: this.first_client_id,
      first_team_id: this.first_team_id,
      id: this.id,
      replay: this.replay,
      second_client_id: this.second_client_id,
      second_team_id: this.second_team_id,
      winner: this.winner,
      myName: this.myName,
      enemyName: this.enemyName,
      shared: sharedData,
      firstTeam: firstTeam,
      secondTeam: secondTeam,
      second_team_fighters: this.second_team_fighters,
      first_team_fighters: this.first_team_fighters
    }
  }
}
