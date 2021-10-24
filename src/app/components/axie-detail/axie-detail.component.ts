import { Component, Input, OnInit } from '@angular/core';
import { Axie } from 'src/app/models/axie';

@Component({
  selector: 'app-axie-detail',
  templateUrl: './axie-detail.component.html',
  styleUrls: ['./axie-detail.component.scss'],
})
export class AxieDetailComponent implements OnInit {
  @Input() axie: Axie = new Axie();
  constructor() { }

  ngOnInit() {}

}
