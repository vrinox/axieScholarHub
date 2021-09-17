import { Component, Input, OnInit } from '@angular/core';
import { Axie } from 'src/app/models/axie';

@Component({
  selector: 'app-axie-widget',
  templateUrl: './axie-widget.component.html',
  styleUrls: ['./axie-widget.component.scss'],
})
export class AxieWidgetComponent implements OnInit {
  @Input() axie: Axie = new Axie();
  constructor() { }

  ngOnInit() {}

}
