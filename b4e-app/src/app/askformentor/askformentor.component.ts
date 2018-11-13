import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-askformentor',
  templateUrl: './askformentor.component.html',
  styleUrls: ['./askformentor.component.css']
})
export class AskformentorComponent implements OnInit {

  private mentors; 
  form: FormGroup; 

  constructor(private api: ApiService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AskformentorComponent>) { }

  ngOnInit() {
    this.form = this.fb.group({
      mentorId:''

    });
    this.mentors = []; 
    this.api.getMentors().subscribe((data: {}) => {
      //console.log(data);
      this.mentors = data;
    });

  }

  save(){
    this.dialogRef.close(this.form.value); 
  }

  close(){
    console.log()
    this.dialogRef.close(); 
  }


}
