import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataService } from "../data.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private authenticated = false;
  private loggedIn = false;
  private signUpInProgress = false; 
  private currentUser; 
  private campaign = false; 

  isCampaign:string;
  message:string;

  constructor(private formBuilder: FormBuilder, private api: ApiService, 
    private route: ActivatedRoute, private router: Router,
    private data: DataService) { 

    this.createForm(); 
   
  }

  userForm = new FormGroup ({
    campaignName: new FormControl(),
    campaignDescription: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    participant: new FormControl()
  }); 

  participants = ['Donor','Student','Vendor'];

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentIsCampaign.subscribe(message => this.isCampaign = message);
    this.route
      .queryParams
      .subscribe((queryParams) => {
        const authenticated = queryParams['authenticated'];
        if (authenticated) {
          this.authenticated = true;
          return this.checkWallet(); 
      }});
  }

  createForm(){
    this.userForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      participant: '',
      campaignName: '',
      campaignDescription: ''
    }); 
  }

  newUser(){
    this.signUpInProgress = true;
    var data = [];
    data['firstName'] = this.userForm.get('firstName').value;
    data['lastName'] = this.userForm.get('lastName').value;
    data['email'] = this.userForm.get('email').value;
    data['participant'] = this.userForm.get('participant').value;
    return this.api.postUser(data)
    .then(() => {
      this.getCurrentUser();
    })
    .then(() => {
      this.loggedIn = true;
      this.data.changeMessage("true");
      this.signUpInProgress = false; 
      this.router.navigateByUrl('/profile');
    })

    
  }

  getCurrentUser() {
    return this.api.getCurrentUser()
      .then((currentUser) => {
        this.currentUser = currentUser; 
        console.log(this.currentUser);
        if(this.currentUser.split('.')[2].includes('Campaign')){
          this.campaign = true; 
          this.data.changeIsCampaign("true");
          console.log(this.isCampaign); 
        }
      });
  }

  checkWallet(){
    return this.api.checkWallet()
    .then((results) => {
      if(results['length']>0) {
        console.log('Wallet > 0');
        this.loggedIn = true;
        this.getCurrentUser().then(() => {
          this.data.changeMessage("true");
          if(this.campaign == false)
            this.router.navigateByUrl('/profile');
          else
            this.router.navigateByUrl('/campaignprofile');
        })
        return;
      }
    })
  }

  campaignLogin(){
    if(this.campaign == false){
      this.campaign = true; 
      this.data.changeIsCampaign("true");
      console.log(this.isCampaign);
    } 
    else {
      this.campaign = false;
      this.data.changeIsCampaign("false"); 
      console.log(this.isCampaign);
    }
  }

  newCampaign(){
    var data = [];
    data['campaignName'] = this.userForm.get('campaignName').value;
    data['campaignDescription'] = this.userForm.get('campaignDescription').value;
    data['firstName'] = this.userForm.get('firstName').value;
    data['lastName'] = this.userForm.get('lastName').value;
    data['email'] = this.userForm.get('email').value;
    data['participant'] = this.userForm.get('participant').value;
    return this.api.postCampaign(data)
    .then(() => {
      this.getCurrentUser();
    })
    .then(() => {
      this.loggedIn = true;
      this.data.changeMessage("true");
      this.signUpInProgress = false; 
      if(this.campaign == false)
        this.router.navigateByUrl('/profile');
      else
        this.router.navigateByUrl('/campaignprofile'); 
    })
  }

}
