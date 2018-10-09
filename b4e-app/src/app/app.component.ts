import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'B4E App!';
  


  constructor() {
  	
  }
  ngOnInit(): void {
    
    /*
    this.http.post('http://localhost:3000/api/Donor', {
      email: 'foo3',
      firstName: 'bar',
      lastName: 1
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );*/

     
  }

  
 
   
  
}
