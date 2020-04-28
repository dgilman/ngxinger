import { Component, OnInit, Input } from '@angular/core';

import { MostWantedService } from '../mostwanted.service';
import { MostWanted, MostWantedTableData, MostWantedTableDataFactory } from '../mostwanted';
import { MostWantedMapUpdateService } from '../mostwanted-map-update.service';

@Component({
  selector: 'app-mostwanted-table',
  templateUrl: './mostwanted-table.component.html',
  styleUrls: ['./mostwanted-table.component.css']
})
export class MostwantedTableComponent implements OnInit {
  displayedColumns = ['title', 'delta'];
  private fullDataSource: MostWantedTableData[];
  page = 1;
  pageSize = 10;
  maxSize = 5;

  @Input()
  team: number;

  constructor(
    private mostWantedService: MostWantedService,
    private mostWantedMapUpdateService: MostWantedMapUpdateService
  ) {
    this.fullDataSource = [];
  }

  ngOnInit(): void {
    this.mostWantedService.getMostWanted(this.team).subscribe((mostWanted: MostWanted[]) => {
      // XXX error handling and etc
      this.fullDataSource = mostWanted.map(row => {
        const factory = new MostWantedTableDataFactory(row);
        return factory.toMostWantedTableData();
      });
    });
  }

  get dataSource(): MostWantedTableData[] {
    return this.fullDataSource
      .map((row, i) => ({id: i + 1, ...row}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  get collectionSize() {
    return this.fullDataSource.length;
  }

  jumpToPortal(row: MostWantedTableData) {
    this.mostWantedMapUpdateService.sendMessage(row.coord);
  }
}
