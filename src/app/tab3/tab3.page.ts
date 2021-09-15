import { Component, OnInit } from '@angular/core';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  constructor(private sesion: SesionService) {}
  
  ngOnInit(){
    console.log(this.sesion.axies);
  }
}
