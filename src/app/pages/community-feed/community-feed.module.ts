import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityFeedPageRoutingModule } from './community-feed-routing.module';

import { CommunityFeedPage } from './community-feed.page';
import { ShareComponentModule } from 'src/app/components/shareComponent.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityFeedPageRoutingModule,
    ReactiveFormsModule,
    ShareComponentModule
  ],
  declarations: [CommunityFeedPage]
})
export class CommunityFeedPageModule {}
