import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  message:string;
  private isCampaign:string; 
  private currentUser; 
  private participantType; 
  login:string;

  constructor(private data: DataService, private api: ApiService,  private router: Router) { }

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

    if(this.message === "true"){
      this.login = "Logout";
    } else {
      this.login = "Login";
    }
  }

  registerLogout(){
    this.data.currentMessage.subscribe(message => this.message = message);
    if(this.message === "false"){
      //this.cookieService.delete('access_token');
      window.location.href = "http://localhost:3000/auth/google"; 
    }
    else{
      this.api.logout();
      this.data.changeMessage("false");
      this.login = "Login";
    }
    
  }

  goToProfile(){
    if(this.isCampaign === "true" || this.participantType == "Campaign")
      this.router.navigateByUrl('/campaignprofile');
    else
      this.router.navigateByUrl('/profile');
  }
}
