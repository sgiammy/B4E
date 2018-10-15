import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatFormFieldModule } from "@angular/material";
import { FormGroup, FormBuilder, Validators} from '@angular/forms';



@Component({
  selector: 'app-fund-campaign',
  templateUrl: './fund-campaign.component.html',
  styleUrls: ['./fund-campaign.component.css']
})
export class FundCampaignComponent implements OnInit {

  form: FormGroup; 
  private amount = 0;
  private title=""; 
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FundCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.title = data.name; 
  }

  ngOnInit() {
    this.form = this.fb.group({
      //amount: this.amount
  
    });
  }

  save(){
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.dialogRef.close(); 
  }

}
