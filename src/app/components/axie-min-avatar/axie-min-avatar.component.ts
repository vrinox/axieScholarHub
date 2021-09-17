import { Component, Input, OnInit } from '@angular/core';
import { Axie } from 'src/app/models/axie';

@Component({
  selector: 'app-axie-min-avatar',
  templateUrl: './axie-min-avatar.component.html',
  styleUrls: ['./axie-min-avatar.component.scss'],
})
export class AxieMinAvatarComponent implements OnInit {
  @Input() axie: Axie = new Axie();
  @Input() team: string = 'non';
  constructor() { }

  ngOnInit() {}

}
