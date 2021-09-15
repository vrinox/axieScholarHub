import { Part } from "./part";

export class Axie {
  auction?;
  banned: boolean = false;  //{banned: false, __typename: 'AxieBattleInfo'}
  breedCount: number = 3;
  class: string = "";
  id: string = "";
  image: string = "";
  name: string = "";
  parts: Part[];
  stage: number = 0;
  title: string = "";
  cssContainerClass: string = "";
  constructor(values: Object = {}) {
    Object.assign(this, values);
    this.parts = this.parts.map((rawPart)=>{
      return new Part(rawPart);
    })
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
      parts: this.parts.map((part:Part)=>{
        return part.getValues();
      })
    }
  }
}
