import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';

import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-vertical-slider',
  templateUrl: './vertical-slider.component.html',
  styleUrls: ['./vertical-slider.component.scss']
})
export class VerticalSliderComponent implements OnInit, AfterViewInit {
	@ViewChild('bar') barElement: ElementRef;
	@ViewChild('highlightBar') highlightedBarElement: ElementRef;
	@ViewChild('handle') handleElement: ElementRef;

	@Output() changed = new EventEmitter<number>();
  @Input() initialTop: number = 0;

	private handleTopOnPanStart: number;
	private handleTopMax: number;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  	let handleHammer = new Hammer(this.handleElement.nativeElement);
  	handleHammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
  	handleHammer.on('panstart panmove	panend', (event) => this.onHandlePanned(event));

    let barHammer = new Hammer(this.barElement.nativeElement);
    barHammer.on('tap', (event) => this.onTapBar(event));

    this.setHandleTop(this.initialTop, true);
  }

  onTapBar(event: HammerInput) {
    this.setHandleTop(event.center.y - this.barElement.nativeElement.getBoundingClientRect().top - this.handleElement.nativeElement.offsetHeight / 4);
  }

  onHandlePanned(event: HammerInput) {
  	if (event.type == 'panstart') {
  		this.handleTopOnPanStart = this.getHandleTop();
  		this.handleTopMax = this.barElement.nativeElement.offsetHeight;
  	}

  	let newTop = this.handleTopOnPanStart + event.deltaY;

  	if (newTop < 0) newTop = 0;
  	else if (newTop > this.handleTopMax) newTop = this.handleTopMax;
  	
  	this.setHandleTop(newTop);
  }

  getHandleTop(): number {
  	const defaultView = this.handleElement.nativeElement.ownerDocument.defaultView;
  	const top = defaultView.getComputedStyle(this.handleElement.nativeElement).top;

  	return parseInt(/\d+/.exec(top)[0]);
  }

  setHandleTop(top: number, omitEventEmitting?: boolean) {
  	const barHeight = this.barElement.nativeElement.offsetHeight;

  	this.handleElement.nativeElement.style.top = top + 'px';
  	this.highlightedBarElement.nativeElement.style.height = barHeight - top + 'px';

  	if (!omitEventEmitting) {
  		this.changed.emit(Math.round((1 - top / barHeight) * 100) / 100);
  	}
  }

}
