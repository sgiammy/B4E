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

  message:string;

  constructor(private formBuilder: FormBuilder, private api: ApiService, 
    private route: ActivatedRoute, private router: Router,
    private data: DataService) { 
    this.createForm(); 
    this.data.currentMessage.subscribe(message => this.message = message);
  }

  userForm = new FormGroup ({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    participant: new FormControl()
  }); 

  participants = ['Donor','Student','Vendor'];

  ngOnInit() {
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
      participant: ''
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
      });
  }

  checkWallet(){
    return this.api.checkWallet()
    .then((results) => {
      if(results['length']>0) {
        console.log('Wallet > 0');
        this.loggedIn = true;
        this.data.changeMessage("true");
        this.router.navigateByUrl('/profile');
        return this.getCurrentUser(); 
      }
    })
  }

}
