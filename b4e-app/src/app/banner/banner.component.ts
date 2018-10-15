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
  login:string;

  constructor(private data: DataService, private api: ApiService,  private router: Router) { }

  ngOnInit() {
    console.log(this.message);
    this.data.currentMessage.subscribe(message => this.message = message);
    console.log(this.message);
    if(this.message === "true"){
      this.login = "Logout";
    } else {
      this.login = "Login";
    }
  }

  registerLogout(){
    this.data.currentMessage.subscribe(message => this.message = message);
    if(this.message === "false"){
      this.router.navigateByUrl("/register");
    }
    else{
      this.api.logout();
      this.data.changeMessage("false");
      this.router.navigateByUrl('/home'); 
    }
    
  }
}
