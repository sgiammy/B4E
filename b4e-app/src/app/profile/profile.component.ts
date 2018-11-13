import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material'; 
import {AskformentorComponent} from '../askformentor/askformentor.component'; 
import { LeaveReviewComponent } from '../leave-review/leave-review.component'; 
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private currentUser; 
  private participantId; 
  private participantType; 
  private details; 
  private missionContracts:any; 
  private items:any; 
  private fundedCampaigns:any;
  private dialogRef;
  private dialogRef2; 
  private reviewRef; 
  private missions;


  constructor(private api: ApiService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.missionContracts = [];
    this.items = [];
    this.missions =[]; 
    this.fundedCampaigns = []; 
    this.getCurrentUser(); 
   
    
  }

  getCurrentUser() {
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
        this.getUserById(); 
        
      })
    
  }

  getUserById(){
    var words = this.currentUser.split("#");
    var items = words[0].split("."); 

   this.participantId = words[1];
   this.participantType = items[2];  

    this.api.getParticipantById(this.participantType, this.participantId)
      .then((details) => {
        this.details = details; 
        if(this.participantType == "Student"){
          this.api.getMissionContractByStudent(this.participantId).then((missionContracts) => {
            this.missionContracts = missionContracts; 
            for(var i = 0; i< this.missionContracts.length; i++ ){
              console.log(this.missionContracts[i]['dueDate']);
              this.missionContracts[i]['date'] = this.missionContracts[i]['dueDate'].slice(0,10); 
              this.api.getMissionDetails(this.missionContracts[i]['mission'].split('#')[1]).then((details) => {
                this.saveDetails(details); 
              });
            }
          });
        }
        if(this.participantType == "Student" || this.participantType == "Vendor"){
          this.api.getItemsByOwnerId(this.participantType, this.participantId).then((items) => {
            console.log(items);
            this.items = items; 
          });
        }
        if(this.participantType == "Donor"){
          this.api.getFundCampaignByDonor(this.participantId).then((transactions) => {
            this.fundedCampaigns = transactions; 
            for(var i = 0; i <this.fundedCampaigns.length; i++){
              this.api.getParticipantById('Campaign', this.fundedCampaigns[i]['campaign'].split('#')[1]).then((details) => {
                this.saveCampaignDetails(details);
              });
              // get all the missions for that campaign
              console.log("Ciao");
              this.api.getMissionsByCampaign(this.fundedCampaigns[i]['campaign'].split('#')[1]).then((missions)=>{
                console.log(missions);
                this.saveCampaignMissions(missions);
                this.missions = missions; 
                for(var j=0; j<this.missions.length; j++){
                  //for each mission get all the contracts 
                  this.api.getContractsByMission(this.missions[j]['missionId']).then((contracts) => {
                    console.log(contracts);
                    this.saveCampaignContracts(contracts);
                  });
                }
              });
              
            }
            
           
          });
        }
        if(this.participantType == "Mentor"){
          this.api.getMissionContractByMentor(this.participantId).then((missionContracts) => {
            this.missionContracts = missionContracts; 
            for(var i = 0; i< this.missionContracts.length; i++ ){
              console.log(this.missionContracts[i]['dueDate']);
              this.missionContracts[i]['date'] = this.missionContracts[i]['dueDate'].slice(0,10); 
              this.api.getMissionDetails(this.missionContracts[i]['mission'].split('#')[1]).then((details) => {
                this.saveDetails(details); 
              
              });
            }
          });
        }
      })
  }

  mentorReview(missionContractId){
    var file = document.querySelector('#file-field').files[0];
    if(file == undefined){
      this.openDialog2('Please upload at least one file.');
    }
    else {
      this.api.mentorReview(missionContractId,file);
    }
  }

  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
    };
   
   this.dialogRef =  this.dialog.open(AskformentorComponent, dialogConfig); 

  

  }

  askForMentor(missionContractId){
    var file = document.querySelector('#file-field').files[0];
    console.log(file['name']);
    
    if(file == undefined){
      this.openDialog2('Please upload at least one file.');
    }
    else {
      this.openDialog();
      this.dialogRef.afterClosed().subscribe(
        data => {
          console.log("Dialog output: ", data['mentorId']);
          this.api.askForMentor(missionContractId, data['mentorId'], file);
          window.location.reload();
        });
    }
    
   
  }

  private openReviewDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
    };
   
   this.reviewRef =  this.dialog.open(LeaveReviewComponent, dialogConfig); 

  }

  leaveReview(missionContractId){
    this.openReviewDialog(); 
    this.reviewRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output: ", data);
        this.api.leaveReview(missionContractId, data);
        window.location.reload();
      });

  }

  submitMission(missionContractId){
    var file = document.querySelector('#file-field').files[0];
    
    if(file == undefined){
      this.openDialog2('Please upload at least one file.');
    }
    else {
      this.api.submitMission(missionContractId, file);
    }
   
  }

  saveDetails(details){
    for(var i = 0; i < this.missionContracts.length; i++) {
      if(this.missionContracts[i]['mission'].split('#')[1] == details['missionId']){
        this.missionContracts[i]['missionName'] = details['missionName'];
        this.missionContracts[i]['mentorFare'] = details['mentorFare'];
      }
    }
  }

  saveCampaignDetails(details){
    for(var i = 0; i < this.fundedCampaigns.length; i++) {
      if(this.fundedCampaigns[i]['campaign'].split('#')[1] == details['email'])
        this.fundedCampaigns[i]['campaignName'] = details['campaignName'];
    }
  }

  saveCampaignMissions(missions){
    for(var i = 0; i < this.fundedCampaigns.length; i++) {
      if(this.fundedCampaigns[i]['campaign'] == missions[0]['campaign'])
        this.fundedCampaigns[i]['missions'] = missions;
    }
  }

  saveCampaignContracts(contracts){
    for(var i=0; i<this.fundedCampaigns.length; i++){
      for(var j=0; j < this.fundedCampaigns[i]['missions'].length; j++){
        if(this.fundedCampaigns[i]['missions'][j]['missionId'] == 
            contracts[0]['mission'].split('#')[1]){
              this.fundedCampaigns[i]['missions'][j]['contracts']= contracts;
            }
      }
    }
  }

  private openDialog2(error) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      error: error,
    };   
   
   this.dialogRef2 =  this.dialog.open(ErrorComponent, dialogConfig); 

  }

  download(filename, file){
    console.log(filename);
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
