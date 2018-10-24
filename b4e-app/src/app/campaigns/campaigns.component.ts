import { Component, OnInit } from '@angular/core';
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
  private currentUser;
  private participantType; 
  private amount = 0; 
  private dialogRef;

  ngOnInit() {
     this.api.getCurrentUser()
    .then((currentUser) => {
      this.currentUser = currentUser; 
      this.participantType = currentUser.split('#')[0].split('.')[2];
      console.log(this.participantType);
    });
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
    };
  
   this.dialogRef =  this.dialog.open(FundCampaignComponent, dialogConfig); 

  

  }

  fundCampaign(campaignName, campaignEmail){
    this.openDialog(campaignName);
    this.dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output: ", data);
        this.amount = data.amount;
        console.log(this.amount);
        this.api.fundCampaign(campaignEmail, this.amount, this.currentUser);
      
      });
    }
   
}
