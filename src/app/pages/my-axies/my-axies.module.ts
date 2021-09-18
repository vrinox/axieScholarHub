import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAxiesPageRoutingModule } from './my-axies-routing.module';

import { MyAxiesPage } from './my-axies.page';
import { ShareComponentModule } from 'src/app/components/shareComponent.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAxiesPageRoutingModule,
    ShareComponentModule
  ],
  declarations: [MyAxiesPage]
})
export class MyAxiesPageModule {}
