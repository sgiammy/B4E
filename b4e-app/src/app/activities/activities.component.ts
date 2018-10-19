import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { ApiService } from '../api.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activities:any = [];
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getActivities();
  }

  getActivities(){
    this.activities = [];
    this.api.getActivities().subscribe((data: {}) => {
      //console.log(data);
      this.activities = data;
    });
  }

  enrollStudent(activityId){
    console.log(activityId);
    this.api.enrollStudentToActivity(activityId);

  }


}
