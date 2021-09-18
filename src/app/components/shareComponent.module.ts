import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AxieMinAvatarComponent } from './axie-min-avatar/axie-min-avatar.component';
import { AxieWidgetComponent } from './axie-widget/axie-widget.component';
import { BattleItemListComponent } from './battle-item-list/battle-item-list.component';
import { CardWidgetComponent } from './card-widget/card-widget.component';
import { ListItemUserAvatarComponent } from './list-item-user-avatar/list-item-user-avatar.component';
CardWidgetComponent
@NgModule({
  declarations: [
    CardWidgetComponent,
    AxieWidgetComponent,
    BattleItemListComponent,
    AxieMinAvatarComponent,
    ListItemUserAvatarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CardWidgetComponent,
    AxieWidgetComponent,
    BattleItemListComponent,
    AxieMinAvatarComponent,
    ListItemUserAvatarComponent
  ]
})
export class ShareComponentModule { }