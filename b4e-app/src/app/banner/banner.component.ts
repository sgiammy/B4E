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

  constructor(private data: DataService, private api: ApiService,  private router: Router) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }

  registerLogout(){
    if(this.message === "Login"){
      this.router.navigateByUrl("/register");
    }
    else{
      this.api.logout();
      this.data.changeMessage("Login");
      //this.router.navigateByUrl('/home'); 
    }
    
  }
}
