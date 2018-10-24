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
  private currentUser;
  private participantType; 

  constructor(private data: DataService, 
    private api: ApiService,  
    private router: Router,
    ) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentIsCampaign.subscribe(isCampaign => this.isCampaign = isCampaign);
    
    this.api.getCurrentUser()
    .then((currentUser) => {
      this.currentUser = currentUser; 
      this.participantType = currentUser.split('#')[0].split('.')[2];
      console.log(this.participantType);
    });

    this.api.checkWallet()
    .then((results) => {
      if(results['length']>0) {
        console.log('Wallet > 0');
        this.login = "Logout";
        this.data.changeMessage("true");
      }
      else {
        this.login = "Login";
        this.data.changeMessage("false");
      }
    })
   
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
    
    if(this.isCampaign === "true" || this.participantType == "Campaign")
      this.router.navigateByUrl('/campaignprofile');
    else
      this.router.navigateByUrl('/profile');
  }

}
