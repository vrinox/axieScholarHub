import { Component, Input, OnInit } from '@angular/core';
import { Battle } from 'src/app/models/battle';

@Component({
  selector: 'app-battle-item-list',
  templateUrl: './battle-item-list.component.html',
  styleUrls: ['./battle-item-list.component.scss'],
})
export class BattleItemListComponent implements OnInit {
  @Input() battle: Battle = new Battle();
  constructor() { }

  ngOnInit() {}

  mostrarReplay(){
    
  }
}
