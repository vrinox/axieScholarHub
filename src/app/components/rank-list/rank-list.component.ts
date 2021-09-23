import { Component, Input, OnInit } from '@angular/core';
import { Axie } from 'src/app/models/axie';
import { Scholar } from 'src/app/models/scholar';

@Component({
  selector: 'app-rank-list',
  templateUrl: './rank-list.component.html',
  styleUrls: ['./rank-list.component.scss'],
})
export class RankListComponent implements OnInit {
  @Input() scholar: Scholar = new Scholar();
  @Input() axie: Axie =new Axie();
  @Input() team: string = "first";
  @Input() type: string = "normal";
  constructor() { }

  ngOnInit() {}

}
