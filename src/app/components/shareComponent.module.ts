import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AxieWidgetComponent } from './axie-widget/axie-widget.component';
import { CardWidgetComponent } from './card-widget/card-widget.component';
CardWidgetComponent
@NgModule({
    declarations: [CardWidgetComponent, AxieWidgetComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [CardWidgetComponent, AxieWidgetComponent]
})
export class ShareComponentModule {}