import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder, FormControl, FormArray} from '@angular/forms';

@Component({
  selector: 'app-evaluate-activities',
  templateUrl: './evaluate-activities.component.html',
  styleUrls: ['./evaluate-activities.component.css']
})
export class EvaluateActivitiesComponent implements OnInit {

  form: FormGroup; 
  private activities = [];
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EvaluateActivitiesComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.activities = data.activities; 
    console.log(this.activities);
  }

  ngOnInit() {
    const controls = this.activities.map(c=> new FormControl(false));
    this.form = this.fb.group({
      completedActivities: new FormArray(controls)
    });
  }

  save(){
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.dialogRef.close(); 
  }

}
