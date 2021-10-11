import { Axie } from "./axie";
import { atFighter } from "./interfaces";

export class Battle {
  myName?: string = "";
  enemyName?: string = "";
  battle_type: number = 0;
  battle_uuid: string = "";
  created_at?: Date;
  fighters: atFighter[] = [];
  first_client_id: string = "";
  first_team_id: string = "";
  id: string = "";
  replay: string = "";
  second_client_id: string = "";
  second_team_id: string = "";
  winner: number = 0;
  firstTeam: Axie[] = [];
  secondTeam: Axie[] = [];
  shared?: any;
  win?: boolean = false;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
  getValues() {
    return {
      battle_type: this.battle_type,
      battle_uuid: this.battle_uuid,
      created_at: this.created_at,
      fighters: this.fighters,
      first_client_id: this.first_client_id,
      first_team_id: this.first_team_id,
      id: this.id,
      replay: this.replay,
      second_client_id: this.second_client_id,
      second_team_id: this.second_team_id,
      winner: this.winner,
    }
  }
  getSharedValues(sharedData?){
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
      firstTeam: this.firstTeam.map( axie => axie.getValuesMin()),
      secondTeam: this.secondTeam.map( axie => axie.getValuesMin()),
      shared: sharedData
    }
  }
}
