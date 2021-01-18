import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { subNavInfo } from 'src/app/models/car.model';

@Component({
  selector: 'app-sub-nav',
  templateUrl: './sub-nav.component.html',
  styleUrls: ['./sub-nav.component.scss']
})
export class SubNavComponent implements OnInit {
  @Input() subNavInfo: subNavInfo;
  @Output() gridViewToggle = new EventEmitter()
  @Output() searched = new EventEmitter();
  @Output() dialogOpened = new EventEmitter();
  @Output() actionBtnClicked = new EventEmitter();
  @Output() syncClicked = new EventEmitter();

  isGrid = false;
  searchTerm: any;
  constructor(private router: Router, private route: ActivatedRoute, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  search(){
    this.searched.emit(this.searchTerm);
  }

  sync(){
    this.syncClicked.emit(this.searchTerm);
  }

  filter(){
    this.dialogOpened.emit();
  }

  navigateBack() {
    this.router.navigate([this.subNavInfo.backLink])
  }

  navigateToAction() {
    if(!this.subNavInfo.actionLink){
      return this.actionBtnClicked.emit();
    } else {
        this.router.navigate(this.subNavInfo.actionLink, { relativeTo: this.route })
    }
  }

  setGridView(){
    this.isGrid = !this.isGrid;
    this.gridViewToggle.emit();
  }
//['edit', 'new']
}
