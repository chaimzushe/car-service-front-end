import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-renderer',
  templateUrl: './edit-renderer.component.html',
  styleUrls: ['./edit-renderer.component.scss']
})
export class EditRendererComponent implements OnInit {
  params: any;

  constructor(private router: Router) { }

  ngOnInit() {}

  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    // do i need the next line?
    return true;
  }

  goToeEditPage() {
     this.router.navigate(['services' , this.params.data.id])
  }

}
