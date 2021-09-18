import { Component, Input, OnInit } from '@angular/core';
import { Axie } from 'src/app/models/axie';
import { Scholar } from 'src/app/models/scholar';

@Component({
  selector: 'app-list-item-user-avatar',
  templateUrl: './list-item-user-avatar.component.html',
  styleUrls: ['./list-item-user-avatar.component.scss'],
})
export class ListItemUserAvatarComponent implements OnInit {
  @Input() scholar: Scholar = new Scholar();
  @Input() axie: Axie =new Axie();
  @Input() team: string = "first";
  constructor() { }

  ngOnInit() {}

}
