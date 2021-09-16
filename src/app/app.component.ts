import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { SesionService } from './services/sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  ready:boolean = false;
  constructor(
    private auth: AuthService, 
    private menu: MenuController,
    private sesion: SesionService,
    private router: Router,
  ) {
    setTimeout(()=>{      
      this.sesion.appStart();
    },100)
    this.sesion.sesionInit$.subscribe((init:boolean)=>{
      this.ready = init;
    })
  }
  navigateTo(url){
    this.router.navigate([url]);
    this.menu.close();
  }
  logout() {
    this.auth.logout();
    this.menu.close()
  }
}
