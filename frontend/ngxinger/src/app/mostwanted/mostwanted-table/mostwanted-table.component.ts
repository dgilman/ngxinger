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
  dataSource: MostWantedTableData[];

  @Input()
  team: number;

  constructor(
    private mostWantedService: MostWantedService,
    private mostWantedMapUpdateService: MostWantedMapUpdateService
  ) {
    this.dataSource = [];
   }

  ngOnInit(): void {
    this.mostWantedService.getMostWanted(this.team).subscribe((mostWanted: MostWanted[]) => {
      // XXX error handling and etc
      this.dataSource = mostWanted.map(row => {
        let factory = new MostWantedTableDataFactory(row);
        return factory.toMostWantedTableData();
      })
    });
  }

  jumpToPortal(row: MostWantedTableData) {
    this.mostWantedMapUpdateService.sendMessage(row.coord);
  }
}
