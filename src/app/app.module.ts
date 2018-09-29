import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LpComponent } from './lp/lp.component';
import { VerticalSliderComponent } from './vertical-slider/vertical-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    LpComponent,
    VerticalSliderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
