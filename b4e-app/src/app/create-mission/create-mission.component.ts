import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-create-mission',
  templateUrl: './create-mission.component.html',
  styleUrls: ['./create-mission.component.css']
})
export class CreateMissionComponent implements OnInit {

  
  form: FormGroup; 
  private step = 0;

  private activityNames = [];
  private activityDescriptions = [];
  private activityCosts = [];
  private numAss = 1 ;

  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateMissionComponent>
  ) 
  { 
    this.step = 0;
  }

  ngOnInit() {
    this.step=0;
    console.log(this.step);
    this.form = this.fb.group({
      missionName:'',
      missionDescription: '',
      completeCampaign: null,
      bonusEducoin: '',
      maxStudents: '',
      mentorFare: '',
      dueDate: '',
      activityNames: '',
      activityDescriptions: '',
      activityCosts: '',
    });
  }

  next(){
    console.log(this.step);
    this.step++;
  }

  newAss(){
    this.activityNames.push(this.form.value['activityNames']);
    this.activityCosts.push(this.form.value['activityCosts']);
    this.activityDescriptions.push(this.form.value['activityDescriptions']);
    this.form.value['activityNames'] = '';
    this.form.value['activityCosts'] = '';
    this.form.value['activityDescriptions'] = '';
    this.numAss++;
  }

  save(){
    this.activityNames.push(this.form.value['activityNames']);
    this.activityCosts.push(this.form.value['activityCosts']);
    this.activityDescriptions.push(this.form.value['activityDescriptions']);
    this.form.value['activityNames'] = this.activityNames;
    this.form.value['activityDescriptions'] = this.activityDescriptions;
    this.form.value['activityCosts'] = this.activityCosts;
    this.step = 0;
    this.numAss = 1; 
    console.log(this.step);
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.step = 0;
    this.numAss = 1; 
    this.dialogRef.close(); 
  }

  counter(i: number) {
    return new Array(i);
  }

}
