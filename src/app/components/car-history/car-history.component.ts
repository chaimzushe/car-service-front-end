import { ColumnApi, GridApi } from '@ag-grid-enterprise/all-modules';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { subNavInfo } from 'src/app/models/car.model';
import { CarServiceService } from 'src/app/services/car-service.service';
import { EditRendererComponent } from '../edit-renderer/edit-renderer.component';
import "ag-grid-enterprise";

@Component({
  selector: 'app-car-history',
  templateUrl: './car-history.component.html',
  styleUrls: ['./car-history.component.scss']
})
export class CarHistoryComponent implements OnInit {
  @ViewChild('gridOptions', { static: false }) gridOptions: AgGridAngular;
  loading = true;
  carNumber: any = "...";
  subs: Subscription[] = [];
  seenRepairs = {
  };

  subNavInfo: subNavInfo = {
    actionText: 'Export to excels',
    backLink: '/services',
    hideFilter: true,
    hideSearch: true
  }

  rowData: any;

  gridApi: GridApi;
  columnApi: ColumnApi;
  allServices: any[] = [];
  frameworkComponents: { editRenderer: typeof EditRendererComponent; };
  constructor(private carServiceService: CarServiceService, private route: ActivatedRoute, private datePipe: DatePipe) { }
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  noItemsText = "Loading...";
  defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    enableRowGroup: true,
    headerCheckboxSelectionFilteredOnly: true,
    suppressPaste: true,
    editable: true
  };



  columnDefs: any[] = [
    {
      pinned: 'left',
      order: 1,
      visible: true,
      width: 40,
      lockPosition: true,
      cellRenderer: "editRenderer",
      suppressToolPanel: "true",
      filter: false,
    },
    { field: 'serviceTime', pinned: 'left' ,  order: 2,},
    { field: 'milesAtService' },
    { field: 'mechanicName' },
    { field: 'status' },
    { field: 'visitType' },
    { field: 'id' , hide: true },
  ];



  sideBar = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
      "filters",
    ],
    defaultToolPanel: "",
  };

  async ngOnInit() {
    this.route.params.subscribe(async p => {
      this.carNumber = p.id;
      this.allServices = await this.carServiceService.applyFilters({}, this.carNumber).toPromise() as any[];
      this.setupRowColData(this.allServices)
    });
    this.frameworkComponents = {
      editRenderer: EditRendererComponent,
    };

  }
  setupRowColData(allServices) {

    this.rowData = allServices.map(s => this.addRowCol(s));
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.setRowData(this.rowData);
    this.loading = false;
  }

  onReady(context) {
    this.gridApi = context.api;
    this.columnApi = context.columnApi;
  }

  addRowCol(s) {
    let row = {
      serviceTime: this.datePipe.transform(s.serviceTime, 'short'),
      milesAtService: s.milesAtService,
      mechanicName: s.mechanicName,
      visitType: s.visitType,
      status: s.status,
      id: s._id
    }
    s.repairs.forEach(r => {
     if(!r.repair) return;
      if (!this.seenRepairs[r.repair.name]) {
        this.seenRepairs[r.repair.name] = true;
        this.columnDefs.push({ field: r.repair.name, width: 150 })
      };
      row[r.repair.name] = `${(r.qty || '-')}`;
    });
    return row;
  }
  exportToCvs() {
    this.gridApi.exportDataAsCsv({fileName: `car-#${this.carNumber}-history`});
  }

  onCellValueChanged(e) {
    console.log(this.allServices[e.rowIndex])
    console.log(e.data)
    // save to backend
  }








}
