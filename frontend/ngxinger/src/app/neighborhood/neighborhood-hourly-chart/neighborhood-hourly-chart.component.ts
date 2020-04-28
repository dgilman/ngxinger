import { Component, OnInit } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { NeighborhoodSelect } from '../neighborhood-select';
import { NeighborhoodSelectService } from '../neighborhood-select.service';
import { NeighborhoodHourlyService } from './neighborhood-hourly.service';
import { NeighborhoodHourlyDataFactory } from './neighborhood-hourly';

@Component({
  selector: 'app-neighborhood-hourly-chart',
  templateUrl: './neighborhood-hourly-chart.component.html',
  styleUrls: ['./neighborhood-hourly-chart.component.css']
})
export class NeighborhoodHourlyChartComponent implements OnInit {
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
  public barChartLabels: Label[] = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM',
                                     '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
                                     '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
                                     '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
                                     '9:00 PM', '10:00 PM', '11:00 PM'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public builtDataSet: ChartDataSets = {
    label: 'Resonators Built',
    data: [],
    backgroundColor: 'green',
    hoverBackgroundColor: 'green',
  };
  public destroyedDataSet: ChartDataSets = {
    label: 'Resonators Destroyed',
    data: [],
    backgroundColor: 'red',
    hoverBackgroundColor: 'red',
  };
  public barChartData: ChartDataSets[] = [
    this.builtDataSet, this.destroyedDataSet,
  ];

  constructor(
    private neighborhoodSelectService: NeighborhoodSelectService,
    private neighborhoodHourlyService: NeighborhoodHourlyService,
  ) { }

  ngOnInit(): void {
    // How all of this works:
    // We are subscribed on the neighborhoodSelect service, which gets triggered
    // when the user picks a new neighborhood.
    // Next, we make the REST API call via NeighborhoodHourlyService.
    // When that returns, we can update bound data on the graph.

    this.neighborhoodSelectService.getMessage().subscribe(neighborhoodSelect => {
      this.updateChart(neighborhoodSelect);
    });
  }

  updateChart(neighborhoodSelect: NeighborhoodSelect) {
    this.neighborhoodHourlyService.getNeighborhoodHours(neighborhoodSelect).subscribe(neighborhoodHours => {
     const hourlyData = new NeighborhoodHourlyDataFactory(neighborhoodHours).toNeighborhoodHourlyData();
     this.builtDataSet.data = hourlyData.built;
     this.destroyedDataSet.data = hourlyData.destroyed;
    });
  }

}
