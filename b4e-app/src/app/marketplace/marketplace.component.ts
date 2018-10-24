import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogConfig} from '@angular/material'; 
import {BuyItemComponent} from '../buy-item/buy-item.component'; 


@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  constructor(private api: ApiService,
    private dialog: MatDialog) { }
  items:any = [];
  private currentUser;
  private participantType; 

  ngOnInit() {
    this.api.getCurrentUser()
    .then((currentUser) => {
      this.currentUser = currentUser; 
      this.participantType = currentUser.split('#')[0].split('.')[2];
      console.log(this.participantType);
    });
    this.getItems();
  }

  getItems(){
    this.items = [];
    this.api.getItems().subscribe((data: {}) => {
      console.log(data);
      this.items = data;
    });
  }

  private openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; 
    dialogConfig.autoFocus = true;
  
    const dialogRef =  this.dialog.open(BuyItemComponent, dialogConfig); 
  }

  buyItem(itemId){ 
    this.api.buyItem(itemId);
    this.openDialog(); 
  }

}
