import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayHistoryViewerComponent } from './play-history-viewer.component';

describe('PlayHistoryViewerComponent', () => {
  let component: PlayHistoryViewerComponent;
  let fixture: ComponentFixture<PlayHistoryViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayHistoryViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayHistoryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
