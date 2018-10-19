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
    this.getCurrentUser();
  }

  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
  
    dialogConfig.data = {

    };
  
    const dialogRef =  this.dialog.open(CreateActivityComponent, dialogConfig); 

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output: ", data);
        var newData = this.changeFormat(data);
        this.api.addActivityToCampaign(newData);
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
        
        this.api.getActivitiesByCampaign(this.participantId)
          .then((activities) => {
            this.activities = activities; 
            console.log(activities);
          });
      });
  }

  addActivity(){
    this.openDialog();
  }

  changeFormat(data){
    var newData = {};
    newData['activityName'] = data['activityName'];
    newData['activityDescription'] = data['activityDescription'];
    newData['completeCampaign'] = data['completeCampaign']; 
    newData['maxStudents'] = data['maxStudents'];
    newData['bonusEducoin'] = data['bonusEducoin']; 

    var assignments = []
    for(var i=0; i<data['assignmentNames'].length; i++){
      assignments.push({
        "name": data['assignmentNames'][i],
        "description": data['assignmentDescriptions'][i],
        "educoin": data['assignmentCosts'][i]
      });
    }
    newData['assignments'] = assignments;

    console.log(newData);
    return newData; 
  }
}
