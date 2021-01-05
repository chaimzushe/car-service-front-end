import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-block',
  templateUrl: './setting-block.component.html',
  styleUrls: ['./setting-block.component.scss']
})
export class SettingBlockComponent implements OnInit {
@Input() setting;
  constructor() { }

  ngOnInit(): void {
    console.log(this.setting)
  }

  navigate(){
    alert('Not ready yet..')
  }

}
