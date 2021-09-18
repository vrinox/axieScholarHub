import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAxiesPage } from './my-axies.page';

const routes: Routes = [
  {
    path: '',
    component: MyAxiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAxiesPageRoutingModule {}
