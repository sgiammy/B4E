import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateActivitiesComponent } from './evaluate-activities.component';

describe('EvaluateActivitiesComponent', () => {
  let component: EvaluateActivitiesComponent;
  let fixture: ComponentFixture<EvaluateActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
