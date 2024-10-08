import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component'; 
import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

@Component({
  selector: 'app-dummy',
  template: '<span>videoflix-frontend app is running!</span>',
  standalone: true
})
class DummyComponent {}

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ 
      RouterTestingModule.withRoutes([
        { path: '', component: DummyComponent }
      ]),
      AppComponent  
    ]
  }).compileComponents());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });



});
