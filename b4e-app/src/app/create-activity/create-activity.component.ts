import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css']
})
export class CreateActivityComponent implements OnInit {

  
  form: FormGroup; 
  private step = 0;

  private assignmentNames = [];
  private assignmentDescriptions = [];
  private assignmentCosts = [];
  private numAss = 1 ;
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateActivityComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) 
  { 
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      activityName:'',
      activityDescription: '',
      completeCampaign: null,
      bonusEducoin: '',
      maxStudents: '',
      dueDate: '',
      assignmentNames: '',
      assignmentDescriptions: '',
      assignmentCosts: '',
    });
  }

  next(){
    this.step++;
  }

  newAss(){
    this.assignmentNames.push(this.form.value['assignmentNames']);
    this.assignmentCosts.push(this.form.value['assignmentCosts']);
    this.assignmentDescriptions.push(this.form.value['assignmentDescriptions']);
    this.form.value['assignmentNames'] = '';
    this.form.value['assignmentCosts'] = '';
    this.form.value['assignmentDescriptions'] = '';
    this.numAss++;
  }

  save(){
    this.assignmentNames.push(this.form.value['assignmentNames']);
    this.assignmentCosts.push(this.form.value['assignmentCosts']);
    this.assignmentDescriptions.push(this.form.value['assignmentDescriptions']);
    this.form.value['assignmentNames'] = this.assignmentNames;
    this.form.value['assignmentDescriptions'] = this.assignmentDescriptions;
    this.form.value['assignmentCosts'] = this.assignmentCosts;
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.dialogRef.close(); 
  }

  counter(i: number) {
    return new Array(i);
  }

}
