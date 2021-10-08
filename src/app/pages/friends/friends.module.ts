import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import { ShareComponentModule } from 'src/app/components/shareComponent.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule,
    ShareComponentModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
