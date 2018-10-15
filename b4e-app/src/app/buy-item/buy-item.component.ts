import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {

  constructor( private dialogRef: MatDialogRef<BuyItemComponent>) { }

  ngOnInit() {
  }

  save(){
    this.dialogRef.close(); 
  }

  close(){
    this.dialogRef.close(); 
  }

}
