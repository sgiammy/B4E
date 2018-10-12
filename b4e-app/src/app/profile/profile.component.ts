import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { DataService } from "../data.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private currentUser; 
  message:string;

  constructor(private api: ApiService, private cookieService: CookieService,
    private router: Router, private data: DataService) { }

  ngOnInit() {
    this.getCurrentUser(); 
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.changeMessage("Logout");
  }

  getCurrentUser() {
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
      })
    
  }

  

}
