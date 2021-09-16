import { Component, Input, OnInit } from '@angular/core';
import { atAbility } from 'src/app/models/interfaces';

@Component({
  selector: 'app-card-widget',
  templateUrl: './card-widget.component.html',
  styleUrls: ['./card-widget.component.scss'],
})
export class CardWidgetComponent implements OnInit {
  @Input() card: atAbility = {
    attack: 0,
    defense: 0,
    backgroundUrl: "#",
    description: "",
    effectIconUrl: "",
    energy: 0,
    id: "",
    name: "",
  }
  constructor() { }

  ngOnInit() {}

}
