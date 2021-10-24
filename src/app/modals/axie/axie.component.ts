import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Axie } from 'src/app/models/axie';
import { atAxieData } from 'src/app/models/interfaces';
import { AxieTechApiService } from 'src/app/services/axie-tech-api.service';

@Component({
  selector: 'app-axie',
  templateUrl: './axie.component.html',
  styleUrls: ['./axie.component.scss'],
})
export class AxieComponent implements OnInit {
  @Input() axie: Axie;
  constructor(
    private modalController: ModalController,
    private axieTechService: AxieTechApiService
  ) { }
  async ngOnInit() {
    const axieFullData: atAxieData = await this.axieTechService.getAxieData(this.axie.id);
    this.axie = this.axieTechService.buildAxieData(this.axie, axieFullData);
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
