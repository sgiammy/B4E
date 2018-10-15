import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundCampaignComponent } from './fund-campaign.component';

describe('FundCampaignComponent', () => {
  let component: FundCampaignComponent;
  let fixture: ComponentFixture<FundCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
