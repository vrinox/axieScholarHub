import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BattlesPage } from './battles.page';

const routes: Routes = [
  {
    path: '',
    component: BattlesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BattlesPageRoutingModule {}
