import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.css']
})
export class MentorsComponent implements OnInit {

  constructor(private api: ApiService) { }
  mentors:any = [];

  ngOnInit() {
    this.getMentors(); 
  }

  getMentors(){
    this.mentors = [];
    this.api.getMentors().subscribe((data: {}) => {
      //console.log(data);
      this.mentors = data;
    });
  }

}
