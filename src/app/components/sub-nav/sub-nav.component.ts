import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subNavInfo } from 'src/app/models/car.model';

@Component({
  selector: 'app-sub-nav',
  templateUrl: './sub-nav.component.html',
  styleUrls: ['./sub-nav.component.scss']
})
export class SubNavComponent implements OnInit {
  @Input() subNavInfo: subNavInfo;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  navigateBack() {
    this.router.navigate([this.subNavInfo.backLink])
  }

  navigateToAction() {
    this.router.navigate(this.subNavInfo.actionLink, { relativeTo: this.route })
  }
//['edit', 'new']
}
