import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';


const API_URL = environment.apiUrl;
const NS = "org.bfore.";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private router: Router) { 
  }

  private extractData(res: Response){
    let body = res; 
    return body || {};
  }

  private handleError(error: any): Observable<string> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
}

  getCampaigns(): Observable<any> {
    return this.http.get('http://localhost:3000/api/' + 'Campaign', {withCredentials: true}).pipe(
      map(this.extractData)
    );
  }

  // Must be changed with a query bc we only want items 
  // whose owner is a vendor, and not a student!
  getItems(): Observable<any> {
    return this.http.get('http://localhost:3000/api/'  + 'Item', {withCredentials: true}).pipe(
      map(this.extractData)
    );
  }

  getActivities(): Observable<any> {
    return this.http.get('http://localhost:3000/api/'  + 'Activity', {withCredentials: true}).pipe(
      map(this.extractData)
    );
  } 

  postUser(data) { 
    return this.http.post(API_URL + data['participant'] , {
      $class: NS + data['participant'],
      email: data['email'],
      firstName: data['firstName'],
      lastName: data['lastName']
    }).toPromise()
    .then(() => {
      const identity = {
        participant: NS + data['participant'] + "#" + data['email'],
        userID: data['email'],
        options: {}
      };

      return this.http.post(API_URL + 'system/identities/issue', identity, 
      {responseType: 'blob'}).toPromise();

    })
    .then((cardData) => {
      console.log('CARD-DATA', cardData);
        const file = new File([cardData], 'myCard.card', 
              {type: 'application/octet-stream', 
              lastModified: Date.now()});
              const formData = new FormData();
              formData.append('card', file);
      
              const headers = new HttpHeaders();
              headers.set('Content-Type', 'multipart/form-data');
              return this.http.post('http://localhost:3000/api/wallet/import', formData, {
                withCredentials: true,
                headers
              }).toPromise();
     });
     
  }

  postCampaign(data) { 
    return this.http.post(API_URL + 'Campaign' , {
      $class: NS + 'Campaign',
      campaignName: data['campaignName'],
      campaignDescription: data['campaignDescription'],
      fundingGoal: 0,
      funded: false,
      completed: false,
      email: data['email'],
      firstName: data['firstName'],
      lastName: data['lastName']
    }).toPromise()
    .then(() => {
      const identity = {
        participant: NS + 'Campaign' + "#" + data['email'],
        userID: data['email'],
        options: {}
      };

      return this.http.post(API_URL + 'system/identities/issue', identity, 
      {responseType: 'blob'}).toPromise();

    })
    .then((cardData) => {
      console.log('CARD-DATA', cardData);
        const file = new File([cardData], 'myCard.card', 
              {type: 'application/octet-stream', 
              lastModified: Date.now()});
              const formData = new FormData();
              formData.append('card', file);
      
              const headers = new HttpHeaders();
              headers.set('Content-Type', 'multipart/form-data');
              return this.http.post('http://localhost:3000/api/wallet/import', formData, {
                withCredentials: true,
                headers
              }).toPromise();
     });
     
  }

  
  checkWallet(){
    return this.http.get('http://localhost:3000/api/wallet',
     {withCredentials: true}).toPromise();
  }

  getCurrentUser(){
    return this.http.get('http://localhost:3000/api/system/ping', {withCredentials:
  true}).toPromise()
    .then((data) => {
      return data['participant']; 
    }); 
  }

  getParticipantById(participantType, participantId){
    // participantType is like Student
    // participantId is like adry@cord.com
    var url = "http://localhost:3000/api/" + participantType + '/' + participantId;  

    return this.http.get(url, {withCredentials: true}
     ).toPromise()
    .then((data) => { 
      return data; 
    });

  }

  logout(){
     this.http.get("http://localhost:3000/auth/logout",
    {withCredentials: true}).toPromise();
  }

  buyItem(itemId){
    return this.http.post('http://localhost:3000/api/' + 'BuyItem' , {
      $class: NS + 'BuyItem',
      item: itemId
    }, {withCredentials: true})
    .toPromise();
  }

  fundCampaign(campaignId, amount){
    return this.http.post('http://localhost:3000/api/'  + 'FundCampaign', {
      $class: NS + 'FundCampaign',
      educoinAmount: amount,
      campaign: campaignId

    }, {withCredentials: true})
    .toPromise(); 
  }

  getActivityContractByStudent(studentId){
    var url = "http://localhost:3000/api/queries/Q5/" + studentId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  getItemsByOwnerId(ownerId){
    var url = "http://localhost:3000/api/queries/Q6/" + ownerId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  getFundCampaignByDonor(donorId){
    var url = "http://localhost:3000/api/queries/Q7/" + donorId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }



  getActivitiesByCampaign(campaignId){
    var url = "http://localhost:3000/api/queries/Q8?campaign=resource%3Aorg.bfore.Campaign%23" + campaignId; 
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  addActivityToCampaign(data){
    var url = "http://localhost:3000/api/AddActivityToCampaign"; 
    return this.http.post(url, {
      $class: NS + 'AddActivityToCampaign',
      activityName: data['activityName'],
      activityDescription: data['activityDescription'],
      completeCampaign: data['completeCampaign'],
      educoin: 0,
      bonusEducoin: data['bonusEducoin'],
      maxStudents: data['maxStudents'],
      assignments: data['assignments'],
      activityType: "LEARNING",
      

    }, {withCredentials: true})
    .toPromise(); 
  }

  enrollStudentToActivity(activityId){
    var activity = "resource:org.bfore.Activity#" + activityId ; 

    var url = "http://localhost:3000/api/EnrollStudentToActivity"; 
    return this.http.post(url, {
      $class: NS + 'EnrollStudentToActivity',
      dueDate: "2019-10-18T19:11:33.786Z",
      earnedEducoin: 0,
      winner: false,
      activity: activity
    }, {withCredentials: true})
    .toPromise(); 
  }

}
