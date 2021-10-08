import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrongVersionPage } from './wrong-version.page';

const routes: Routes = [
  {
    path: '',
    component: WrongVersionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WrongVersionPageRoutingModule {}
