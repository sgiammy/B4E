import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogConfig} from '@angular/material'; 
import { CreateMissionComponent } from '../create-mission/create-mission.component';
import { EvaluateActivitiesComponent } from '../evaluate-activities/evaluate-activities.component';

@Component({
  selector: 'app-campaign-profile',
  templateUrl: './campaign-profile.component.html',
  styleUrls: ['./campaign-profile.component.css']
})
export class CampaignProfileComponent implements OnInit {

  constructor(private api: ApiService,
    private dialog: MatDialog) { }

  private missions:any; 
  private details:any; 
  private contracts:any; 
  private currentUser;
  private participantType;
  private participantId; 
  private dialogRef; 

  ngOnInit() {
    this.getCurrentUser();
  }

  private openDialog() {
    this.missions = [];
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true; 
    //dialogConfig.autoFocus = true;
  
    this.dialogRef =  this.dialog.open(CreateMissionComponent, dialogConfig); 
    console.log(this.dialogRef); 
    this.dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output: ", data);
        var newData = this.changeFormat(data);
        console.log("Dialog output: ", newData);
        this.api.addMissionToCampaign(newData).then(() => {
          window.location.reload();
        });

      }
    );

  }

  getCurrentUser() {
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
        //console.log('funziona');
        this.getUserById(); 
      })
    
  }

  getUserById(){
    //console.log(this.currentUser);
    var words = this.currentUser.split("#");
    var items = words[0].split("."); 

   this.participantId = words[1];
   this.participantType = items[2];  

    this.api.getParticipantById(this.participantType, this.participantId)
      .then((details) => {
        this.details = details; 
        
        this.api.getMissionsByCampaign(this.participantId)
          .then((missions) => {
            this.missions = missions; 
            console.log(missions);
            for (var i=0; i<this.missions.length; i++){
              console.log(this.missions[i]['missionId']);
              this.api.getContractsByMission(this.missions[i]['missionId'])
                .then((contracts) => {
                  this.contracts = contracts;
                  console.log(this.contracts);
                  this.addContractsToMission(); 
                })
            }
          });
      });
  }

  addMission(){
    this.openDialog();
  }

  changeFormat(data){
    var newData = {};
    newData['missionName'] = data['missionName'];
    newData['missionDescription'] = data['missionDescription'];
    newData['completeCampaign'] = data['completeCampaign']; 
    newData['maxStudents'] = data['maxStudents'];
    newData['mentorFare'] = data['mentorFare'];
    newData['bonusEducoin'] = data['bonusEducoin']; 
    newData['dueDate'] = data['dueDate'];
    // change date to datetime 

    var activities = []
    for(var i=0; i<data['activityNames'].length; i++){
      activities.push({
        "name": data['activityNames'][i],
        "description": data['activityDescriptions'][i],
        "educoin": data['activityCosts'][i]
      });
    }
    newData['activities'] = activities;

    console.log(newData);
    return newData; 
  }

  addContractsToMission(){
    for(var i = 0; i<this.missions.length; i++){
      if(!this.missions[i]['contracts'])
        this.missions[i]['contracts'] = [];
      for(var j=0; j<this.contracts.length; j++){
        if(this.contracts[j]['mission'].split('#')[1] == this.missions[i]['missionId'])
          this.missions[i]['contracts'].push(this.contracts[j]);
      }
      //console.log(this.missions[i]['contracts']);
     
    }
  }

  evaluateMission(mission, contractId){
    this.openDialog2(mission,contractId); 
  }

  private openDialog2(mission, contractId) {
   
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
  
    dialogConfig.data = {
      activities: mission['activities']
    };
  
    const dialogRef =  this.dialog.open(EvaluateActivitiesComponent, dialogConfig); 

    dialogRef.afterClosed().subscribe(
      data => {
        //data = new Array(data);
        //console.log("Dialog output: ", data['completedActivities']);
       
        this.api.evaluateMission(contractId, data['completedActivities']).then(() => {
          window.location.reload();
        })
       
      }
    );

  }

  download(filename, file){
    //console.log(filename);
    this.start_download(filename, file); 

  }

  start_download(filename, text) {
    var file = this.dataURLtoFile(text, filename);
    //console.log(file);
    
    var element = document.createElement('a');
    var url =  URL.createObjectURL(file);
    element.href = url; 

    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
    
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

}
