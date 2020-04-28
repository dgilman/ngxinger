import { Component, OnInit } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { NeighborhoodSelect } from '../neighborhood-select';
import { NeighborhoodSelectService } from '../neighborhood-select.service';
import { NeighborhoodPlayerService } from './neighborhood-player.service';
import { NeighborhoodPlayerDataFactory } from './neighborhood-player';

@Component({
  selector: 'app-neighborhood-player-chart',
  templateUrl: './neighborhood-player-chart.component.html',
  styleUrls: ['./neighborhood-player-chart.component.css']
})
export class NeighborhoodPlayerChartComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true,
      }]
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public builtDataSet = {label: 'Resonators Built', data: [], backgroundColor: 'green'};
  public destroyedDataSet = {label: 'Resonators Destroyed', data: [], backgroundColor: 'red'};
  public barChartData: ChartDataSets[] = [
    this.builtDataSet, this.destroyedDataSet,
  ];

  constructor(
    private neighborhoodSelectService: NeighborhoodSelectService,
    private neighborhoodHourlyService: NeighborhoodPlayerService,
  ) { }

  ngOnInit(): void {
    this.neighborhoodSelectService.getMessage().subscribe(neighborhoodSelect => {
      this.updateChart(neighborhoodSelect);
    });
  }

  updateChart(neighborhoodSelect: NeighborhoodSelect) {
    this.neighborhoodHourlyService.getNeighborhoodPlayers(neighborhoodSelect).subscribe(neighborhoodPlayers => {
      const hourlyData = new NeighborhoodPlayerDataFactory(neighborhoodPlayers).toNeighborhoodPlayerData();
      this.builtDataSet.data = hourlyData.built;
      this.destroyedDataSet.data = hourlyData.destroyed;
      this.barChartLabels = hourlyData.playerNames;
     });
  }

}
