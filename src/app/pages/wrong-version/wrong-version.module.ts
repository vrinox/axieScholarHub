import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WrongVersionPageRoutingModule } from './wrong-version-routing.module';

import { WrongVersionPage } from './wrong-version.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WrongVersionPageRoutingModule
  ],
  declarations: [WrongVersionPage]
})
export class WrongVersionPageModule {}
