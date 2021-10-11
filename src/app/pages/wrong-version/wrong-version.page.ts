import { Component, OnInit } from '@angular/core';
import { FireServiceService } from 'src/app/services/fire-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wrong-version',
  templateUrl: './wrong-version.page.html',
  styleUrls: ['./wrong-version.page.scss'],
})
export class WrongVersionPage implements OnInit {
  appVersion: string  = '';
  constructor(
    public fire: FireServiceService
  ) { 
    
  }

  async ngOnInit() {
    this.appVersion = (await this.fire.getApp()).version;
  }

}
