import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { ApiService } from '../api.service';
import {MatDialog, MatDialogConfig} from '@angular/material'; 
import {FundCampaignComponent} from '../fund-campaign/fund-campaign.component'; 


@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  constructor(private api: ApiService,
    private dialog: MatDialog) { }

  campaigns:any = [];
  private amount = 0; 

  ngOnInit() {
    this.getCampaigns(); 
  }

  getCampaigns(){
    this.campaigns = [];
    this.api.getCampaigns().subscribe((data: {}) => {
      //console.log(data);
      this.campaigns = data;
    });
  }

  private openDialog(campaignName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      name: campaignName,
      amount: 0
    };
  
    const dialogRef =  this.dialog.open(FundCampaignComponent, dialogConfig); 

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output: ", data);
        this.amount = data.amount;
      }
    );

  }

  fundCampaign(campaignName, campaignEmail){
    this.openDialog(campaignName);
    this.api.fundCampaign(campaignEmail, this.amount);
  }
}
