import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private currentUser; 


  constructor(private api: ApiService, private cookieService: CookieService,
    private router: Router) { }

  ngOnInit() {
    this.getCurrentUser(); 
  
    
  }

  getCurrentUser() {
    this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
      })
    
  }

  

}
