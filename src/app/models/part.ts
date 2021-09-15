export class Part {
    baseUrl = "https://storage.googleapis.com/axie-cdn/game/cards/base";
    id: string = "";
    partName: string =  "";
    skillName: string =  "";
    defaultAttack: number =  0;
    defaultDefense: number =  0;
    defaultEnergy: number =  0;
    expectType: string =  "";
    iconId: string =  "";
    triggerColor: string =  "";
    triggerText: string =  "";
    description: string =  "";
    cardURL: string = "";
    constructor(values: Object = {}) {
      Object.assign(this, values);
      this.cardURL = this.getCardImage();
    }
    getCardImage(){
      return `${this.baseUrl}/${this.id}.png`;
    }
    getValues() {
      return {
        id: this.id,
        partName: this.partName,
        skillName: this.skillName,
        defaultAttack: this.defaultAttack,
        defaultDefense: this.defaultDefense,
        defaultEnergy: this.defaultEnergy,
        expectType: this.expectType,
        iconId: this.iconId,
        triggerColor: this.triggerColor,
        triggerText: this.triggerText,
        description: this.description,
        cardUrl: this.cardURL
      }
    }
  }