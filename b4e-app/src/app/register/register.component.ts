import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private authenticated = false;
  private loggedIn = false;
  private signUpInProgress = false; 

  constructor(private formBuilder: FormBuilder, private api: ApiService, private route: ActivatedRoute) { 
    this.createForm(); 
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
      this.checkWallet(); 
    });

    
  }

  checkWallet(){
    return this.api.checkWallet()
    .then((results) => {
      if(results['length']>0) {
        this.loggedIn = true;
      }
    })
  }

}
