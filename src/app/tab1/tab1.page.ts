import { Component } from '@angular/core';
import {ref, Database, onValue} from '@angular/fire/database'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public db: Database) {
    this.getData();
  }
  getData() {    
    onValue(ref (this.db, 'scholars'),(snapshot)=>{
      console.log(snapshot.val());
    })
  }

}
