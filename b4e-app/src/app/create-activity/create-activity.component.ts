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
  private activityName;
  private activityDescription;
  private completeCampaign;
  private bonusEducoin;
  private maxStudents;
  private assignments; 
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateActivityComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) 
  { 
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      activityName: this.activityName,
      activityDescription: this.activityDescription,
      completeCampaign: this.completeCampaign,
      bonusEducoin: this.bonusEducoin,
      maxStudents: this.maxStudents
  
    });
  }

  save(){
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.dialogRef.close(); 
  }

}
