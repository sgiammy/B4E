import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder} from '@angular/forms';



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
      amount: 0
  
    });
  }

  save(){
    this.dialogRef.close(this.form.value); 
  }

  close(){
    this.dialogRef.close(); 
  }

}
