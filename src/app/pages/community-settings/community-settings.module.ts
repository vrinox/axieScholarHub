import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunitySettingsPageRoutingModule } from './community-settings-routing.module';

import { CommunitySettingsPage } from './community-settings.page';
import { ShareComponentModule } from 'src/app/components/shareComponent.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunitySettingsPageRoutingModule,
    ReactiveFormsModule,
    ShareComponentModule
  ],
  declarations: [CommunitySettingsPage]
})
export class CommunitySettingsPageModule {}
