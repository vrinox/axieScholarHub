import { Axie } from "./axie";

export class Battle {
  battle_type: number = 0;
  battle_uuid: string = "";
  created_at?: Date;
  fighters: Axie[] = [];
  first_client_id: string = "";
  first_team_id: string = "";
  id: string = "";
  replay: string = "";
  second_client_id: string = "";
  second_team_id: string = "";
  winner: number = 0;

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
}
