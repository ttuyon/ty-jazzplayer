import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lp',
  templateUrl: './lp.component.html',
  styleUrls: ['./lp.component.scss']
})
export class LpComponent implements OnInit {
	@Input('albumCover') albumCover: string;
	
	@Output('toggled') toggled = new EventEmitter();
  
  public playing: boolean;

  constructor() { }

  ngOnInit() {
  }
}
