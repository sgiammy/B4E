import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallbannerComponent } from './smallbanner.component';

describe('SmallbannerComponent', () => {
  let component: SmallbannerComponent;
  let fixture: ComponentFixture<SmallbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
