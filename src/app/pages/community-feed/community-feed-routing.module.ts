import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityFeedPage } from './community-feed.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityFeedPageRoutingModule {}
