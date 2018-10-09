import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private api: ApiService) { 
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
    var data = [];
    data['firstName'] = this.userForm.get('firstName').value;
    data['lastName'] = this.userForm.get('lastName').value;
    data['email'] = this.userForm.get('email').value;
    data['participant'] = this.userForm.get('participant').value;
    this.api.postUser(data); 
  }

}
