import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskformentorComponent } from './askformentor.component';

describe('AskformentorComponent', () => {
  let component: AskformentorComponent;
  let fixture: ComponentFixture<AskformentorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskformentorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskformentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
