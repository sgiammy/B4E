import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogConfig} from '@angular/material'; 
import { CreateActivityComponent } from '../create-activity/create-activity.component';

@Component({
  selector: 'app-campaign-profile',
  templateUrl: './campaign-profile.component.html',
  styleUrls: ['./campaign-profile.component.css']
})
export class CampaignProfileComponent implements OnInit {

  constructor(private api: ApiService,
    private dialog: MatDialog) { }

  private activities:any; 
  private currentUser;
  private participantType;
  private participantId; 
  private details; 

  ngOnInit() {
    this.getCurrentUser()
    this.getActivitiesByCampaign();
  }

  getActivitiesByCampaign(){
    this.api.getAtivitiesByCampaign(this.participantId);
  }

  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
  
    dialogConfig.data = {
      campaignName: 'ciao'

    };
  
    const dialogRef =  this.dialog.open(CreateActivityComponent, dialogConfig); 

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output: ", data);
        //this.amount = data.amount;
      }
    );

  }

  getCurrentUser() {
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
        console.log('funziona');
        this.getUserById(); 
      })
    
  }

  getUserById(){
    var words = this.currentUser.split(".");
    var items = words[2].split("#"); 

   this.participantId = items[1] + '.com';
   this.participantType = items[0];  

    this.api.getParticipantById(this.participantType, this.participantId)
      .then((details) => {
        this.details = details; 
      });
  }

  addActivity(){
    this.openDialog();
  }

}
