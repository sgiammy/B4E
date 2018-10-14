import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ApiService } from '../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-smallbanner',
  templateUrl: './smallbanner.component.html',
  styleUrls: ['./smallbanner.component.css']
})
export class SmallbannerComponent implements OnInit {

  message:string;
  private login:string;

  constructor(private data: DataService, private api: ApiService,  private router: Router) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    if (this.message === "true")
      this.login = "Logout";
    else
      this.login = "Login";
  }

  registerLogout(){
    if(this.message === "false"){
      this.login = "Login";
      this.router.navigateByUrl("/register");
    }
    else{
      this.login = "Logout";
      this.api.logout();
      this.data.changeMessage("false");
      this.router.navigateByUrl('/home'); 
    }
    
  }

}
