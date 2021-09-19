import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('myChart') ctxCont: ElementRef;
  @Input() data: { label: string, value: number }[] = [];
  @Input() title: string = 'Grafico'
  myChart: any;
  constructor(
    private renderer: Renderer2,
    private platform: Platform
  ) {
    Chart.register(...registerables);
    Chart.defaults.color = "white";
    Chart.defaults.borderColor = "#616161"
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      const ctx = this.renderer.createElement('canvas');
      this.renderer.setAttribute(ctx, 'height', (this.platform.height() * 0.35).toString());
      this.renderer.appendChild(this.ctxCont.nativeElement, ctx);
      let gradientCtx = this.renderer.createElement('canvas');
      let gradient = gradientCtx.getContext("2d").createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'RGBA(255,119,142,0.9)')
      gradient.addColorStop(1, 'RGBA(0,0,0,0.3)')
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.map(dataItem => dataItem.label),
          datasets: [{
            label: 'Total slp diario',
            data: [...this.data.map(dataItem => dataItem.value), 0, 260],
            borderColor: 'rgba(255,119,142, 0.7)',
            backgroundColor: gradient,
            tension: 0.1,
            fill:true
          }]
        },
        options: {
          scales: {
            y: {
              grid: {
                borderDash: [4, 2]
              },
              ticks:{
                font:{
                  size: 8
                }
              }
            },
            x: {
              grid: { display: false },
              ticks:{
                font:{
                  size: 8
                }
              }
            }
          }
        }
      });
    });

  }

}
