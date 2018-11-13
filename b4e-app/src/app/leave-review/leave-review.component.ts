import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.css']
})
export class LeaveReviewComponent implements OnInit {
  form: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveReviewComponent>
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      title:'',
      description:'',
      score:''
  
    });
  }


  save(){
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.dialogRef.close(); 
  }

}
