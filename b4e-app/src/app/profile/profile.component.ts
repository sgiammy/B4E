import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';


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
  private activities:any; 
  private items:any; 
  private campaigns:any;


  constructor(private api: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.activities = [];
    this.items = [];
    this.campaigns = []; 
    this.getCurrentUser(); 
    if(this.participantType === "Student"){
      this.api.getActivityContractByStudent(this.participantId).then((activityContracts) => {
        this.activities = activityContracts; 
      });
    }
    if(this.participantType == "Student" || this.participantType == "Vendor"){
      this.api.getItemsByOwnerId(this.participantId).then((items) => {
        this.items = items; 
      });
    }
    if(this.participantType === "Donor"){
      this.api.getFundCampaignByDonor(this.participantId).then((transactions) => {
        this.campaigns = transactions; 
      });
    }
    
  }

  getCurrentUser() {
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
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
      })
  }

  

}
