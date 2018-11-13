import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogConfig} from '@angular/material'; 
import {ErrorComponent} from '../error/error.component'; 

@Component({
  selector: 'app-activities',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {
  missions:any = [];
  private currentUser; 
  private participantType;
  private dialogRef;

  constructor(private api: ApiService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.getMissions();
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
        this.participantType = currentUser.split('#')[0].split('.')[2];
        console.log(this.participantType);
      });
  }

  getMissions(){
    this.missions = [];
    this.api.getMissions().subscribe((data: {}) => {
      //console.log(data);
      this.missions = data;
     
      for(var i = 0; i < this.missions.length; i++){
        var campaignId = this.missions[i]['campaign'].split('#')[1];
        this.getCampaignName(i, campaignId);
      }
      // We must only show the activities, whose campaign is already funded and completed
    });
  }

  private openDialog(error) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      error: error,
    };
   
   this.dialogRef =  this.dialog.open(ErrorComponent, dialogConfig); 

  

  }


  enrollStudent(missionId){
    console.log(missionId);
    this.api.enrollStudentToMission(missionId).then(() => {
      window.location.reload();
    })
    .catch(() =>{
      this.openDialog("Sorry. Something went wrong.");
    });
    
  }

  getCampaignName(index, campaignId){
    this.api.getCampaignById(campaignId).then((campaign) => {
      this.missions[index]['campaignName'] = campaign['campaignName'];  
      this.missions[index]['funded'] = campaign['funded'];  
    })
  }


}
