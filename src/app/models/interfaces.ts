import { Axie } from "./axie";
import { Battle } from "./battle";
import { Scholar } from "./scholar";

export interface scholarOfficialData {
  ronin_address: string,
  ronin_slp?: number,
  total_slp?: number,
  in_game_slp?: number,
  slp_success?: number,
  rank: number,
  mmr: number,
  total_matches: number,
  win_rate?: string,
  name: string,
  game_stats_success?: string
}

export interface statsData {
  client_id: string,
  win_total: number,
  draw_total: number,
  lose_total: number,
  elo: number,
  rank: number,
  name: string
}

export interface earningsData {
  address: string,
  slp_holdings: number,
  slp_inventory: number,
  slp_in_total: number,
  last_claimed: number,
  next_claim: string,
}
export interface scholarFirebaseI {
  roninAddress: string,
  name: string;
}

export interface userLink {
  uid: string;
  roninAddress: string;
  avatar: string;
  userAvatar?: Axie;
}

export interface userCloudData {
  userData: any;
  scholar: any;
  axies?: any[];
}
export interface part {
  class: string;
  id: string;
  name: string;
  specialGenes?: string;
  type: string;
}
export interface atAxieData {
  stats: atStats;
  parts: atPart[],
  id: string;
  name: string;
  class: string;
  birthDate: number;
  bodyShape: string;
  breedCount: number;
  figure: any;
  traits: {
    color: atGenoma;
    ears: atGenoma;
    eyes: atGenoma;
    horn: atGenoma;
    mouth: atGenoma;
    pattern: atGenoma;
  }
}
export interface atStats {
  hp: number;
  morale: number;
  skill: number;
  speed: number;
}
export interface atPart {
  abilities: atAbility[],
  class: string;
  id: string;
  name: string;
  specialGenes: null;
  stage: number;
  type: string;
}
export interface atAbility {
  attack: number;
  defense: number;
  backgroundUrl: string;
  description: string;
  effectIconUrl: string;
  energy: number;
  id: string;
  name: string;
}
export interface atGenoma {
  d: atGen;
  r1: atGen;
  r2: atGen;
}
export interface atGen {
  class: string;
  name: string;
  partId: string;
  specialGenes: string;
  type: string;
}
export interface atFighter{
  fighter_class: string;
  fighter_id: number;
  fighter_level: number;
  team_id: string;
}
export interface sharedData{
  scholar: any,
  axie: any,
  text?: string
}
export interface coinCrypto{
  image: {
    large: string;
    small: string;
    thumb: string;
  }
  id: string;
}
export interface userList {axie:Axie, scholar:Scholar}
export interface friendRequest {from: string, to: string, id: string, fromName: string}
export interface communityRequest {from: string, communityId: string, id: string, fromName: string}
export interface community {
  type:string;
  name:string;
  id:string;
  members?: any[];
  admin?: string;
  rankType: string;
  discord?: string;
  feed?: any[];
}
export interface communityPost{
  author: any;
  text: string;
  creationDate: Date;
  communityId: string;
}
export interface profile{
  battles: Battle[];
  user?: userLink;
  scholar: Scholar;
  axies: Axie[];
  axieAvatar?: Axie;
}