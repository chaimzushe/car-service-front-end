import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sub-nav',
  templateUrl: './sub-nav.component.html',
  styleUrls: ['./sub-nav.component.scss']
})
export class SubNavComponent implements OnInit {

  constructor(private router : Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  navigateBack(){
    this.router.navigate(['/home'])
  }

  navigateToAction(){
    this.router.navigate(['edit', 'new'], {relativeTo: this.route})
  }

}
