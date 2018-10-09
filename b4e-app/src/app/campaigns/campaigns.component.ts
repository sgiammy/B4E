import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { ApiService } from '../api.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  constructor(private api: ApiService) { }
  campaigns:any = [];

  ngOnInit() {
    this.getCampaigns(); 
  }

  getCampaigns(){
    this.campaigns = [];
    this.api.getCampaigns().subscribe((data: {}) => {
      console.log(data);
      this.campaigns = data;
    });
  }
}
