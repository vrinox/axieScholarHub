import { Component, OnInit } from '@angular/core';
import { ComunityService } from '../services/community.service';
import { SesionService } from '../services/sesion.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  community: any = null;
  constructor(
    private sesion: SesionService,
    private communityService: ComunityService
  ) {
   
  }
  ngOnInit() {
    this.community = this.sesion.communities[0];
  }

}
