import { Component, OnInit } from '@angular/core';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-my-axies',
  templateUrl: './my-axies.page.html',
  styleUrls: ['./my-axies.page.scss'],
})
export class MyAxiesPage implements OnInit {

  constructor(
    public sesion: SesionService
  ) { }

  ngOnInit() {
  }

}
