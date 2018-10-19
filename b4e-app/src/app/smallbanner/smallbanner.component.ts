import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 


@Component({
  selector: 'app-smallbanner',
  templateUrl: './smallbanner.component.html',
  styleUrls: ['./smallbanner.component.css']
})
export class SmallbannerComponent implements OnInit {

  message:string;
  private login:string;
  private isCampaign:string;

  constructor(private data: DataService, 
    private api: ApiService,  
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentIsCampaign.subscribe(isCampaign => this.isCampaign = isCampaign);
    if (this.message === "true")
      this.login = "Logout";
    else
      this.login = "Login";
  }

  registerLogout(){
    if(this.message === "false"){
      this.login = "Login";
      //this.cookieService.delete('access_token');  
      window.location.href = "http://localhost:3000/auth/google"; 
    }
    else{
      this.login = "Logout";
      this.api.logout();
      this.data.changeMessage("false");
      this.router.navigateByUrl('/home'); 
    }
    
  }

  goToProfile(){
    console.log(this.isCampaign);
    if(this.isCampaign === "true")
      this.router.navigateByUrl('/campaignprofile');
    else
      this.router.navigateByUrl('/profile');
  }

}
