import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activities:any = [];
  private currentUser; 
  private participantType;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getActivities();
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
        this.participantType = currentUser.split('#')[0].split('.')[2];
        console.log(this.participantType);
      });
  }

  getActivities(){
    this.activities = [];
    this.api.getActivities().subscribe((data: {}) => {
      //console.log(data);
      this.activities = data;
     
      for(var i = 0; i < this.activities.length; i++){
        var campaignId = this.activities[i]['campaign'].split('#')[1];
        this.getCampaignName(i, campaignId);
      }
      // We must only show the activities, whose campaign is already funded and completed
    });
  }

  enrollStudent(activityId){
    console.log(activityId);
    this.api.enrollStudentToActivity(activityId);

  }

  getCampaignName(index, campaignId){
    this.api.getCampaignById(campaignId).then((campaign) => {
      this.activities[index]['campaignName'] = campaign['campaignName'];  
    })
  }


}
