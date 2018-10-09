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
  }

  getActivities(){
    this.activities = [];
    this.api.getActivities().subscribe((data: {}) => {
      console.log(data);
      this.activities = data;
    });
  }

}
