import { atAbility } from "./interfaces";

export class Axie {
  auction?;
  banned: boolean = false;  //{banned: false, __typename: 'AxieBattleInfo'}
  breedCount: number = 0;
  class: string = "";
  id: string = "";
  image: string = "";
  name: string = "";
  parts: any[] = [];
  abilities: atAbility[] = [];
  stage: number = 0;
  title: string = "";
  stats: any;
  traits?: any;
  teamId?: string;
  cssContainerClass: string = "";
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
  getValues() {
    return {
      auction: this.auction,
      banned: this.banned,
      breedCount: this.breedCount,
      class: this.class,
      id: this.id,
      image: this.image,
      name: this.name,
      stage: this.stage,
      title: this.title,
      parts: this.parts,
      abilities: this.abilities
    }
  }
}
