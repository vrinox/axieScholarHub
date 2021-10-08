import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('myChart') ctxCont: ElementRef;
  @Input() data: { label: string, value: number }[] = [];
  @Input() title: string = 'Grafico'
  myChart: any;
  ctx: HTMLCanvasElement;
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
      this.initializeCanvas();
      this.drawChart();
    });
  }
  ngOnChanges(changes){
    this.platform.ready().then(() => {
      if(changes.data && this.ctx){
         this.myChart.destroy();
         this.drawChart();
      }
    })
  }
  initializeCanvas(){
    this.ctx = this.renderer.createElement('canvas');
    this.renderer.setAttribute(this.ctx, 'height', (this.platform.height() * 0.35).toString());
    this.renderer.appendChild(this.ctxCont.nativeElement, this.ctx);
  }
  clearCanvas(){
    const context = this.ctx.getContext('2d');
    context.clearRect(0, 0, this.ctx.width, this.ctx.height);
  }
  drawChart() {
    let gradientCtx = this.renderer.createElement('canvas');
    let gradient = gradientCtx.getContext("2d").createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, 'RGBA(251,48,82,0.7)')
    gradient.addColorStop(1, 'RGBA(0,0,0,0.2)')
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.data.map(dataItem => dataItem.label),
        datasets: [{
          label: 'Total slp diario',
          data: [...this.data.map(dataItem => dataItem.value), 0, 260],
          borderColor: 'rgba(255, 255, 255, 0.7)',
          backgroundColor: gradient,
          borderWidth: 1,
          tension: 0.1,
          fill: true
        }]
      },
      options: this.getOptions()
    });
  }

  getOptions() {
    return {
      showTooltips: true,
      onAnimationComplete: function() {
        this.showTooltip(this.datasets[0].points, true);
      },
      tooltipEvents: [],
      scales: {
        y: {
          grid: { borderDash: [4, 2] },
          ticks: { font: { size: 8 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 8 } }
        }
      }
    }
  }
}
