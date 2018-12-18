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
    return this.http.get('http://localhost:3001/api/' + 'Campaign').pipe(
      map(this.extractData)
    );
  }

  getMentors(): Observable<any> {
    return this.http.get('http://localhost:3001/api/' + 'Mentor').pipe(
      map(this.extractData)
    );
  }

  // Must be changed with a query bc we only want items 
  // whose owner is a vendor, and not a student!
  getItems(): Observable<any> {
    return this.http.get('http://localhost:3001/api/'  + 'Item').pipe(
      map(this.extractData)
    );
  }

  getMissions(): Observable<any> {
    return this.http.get('http://localhost:3001/api/'  + 'Mission').pipe(
      map(this.extractData)
    );
  } 

  postUser(data) { 
    var amount = 0; 
    if(data['participant']=='Donor')
      amount = 100; 
    return this.http.post(API_URL + data['participant'] , {
      $class: NS + data['participant'],
      email: data['email'],
      firstName: data['firstName'],
      lastName: data['lastName'],
      educoinBalance: amount
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
    var item = "resource:org.bfore.Item#" + itemId; 
    return this.http.post('http://localhost:3000/api/' + 'BuyItem' , {
      $class: NS + 'BuyItem',
      item: item
    }, {withCredentials: true})
    .toPromise();
  }

  fundCampaign(campaignId, amount, donor){

    var campaign = "resource:org.bfore.Campaign#" + campaignId; 

    return this.http.post('http://localhost:3000/api/'  + 'FundCampaign', {
      $class: NS + 'FundCampaign',
      educoinAmount: amount,
      campaign: campaign,
      donor: donor

    }, {withCredentials: true})
    .toPromise(); 
  }

  getMissionContractByStudent(studentId){
    var url = "http://localhost:3000/api/queries/Q5?student=resource%3Aorg.bfore.Student%23" + studentId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  getItemsByOwnerId(participantType, ownerId){
    var url = "http://localhost:3000/api/queries/Q6?owner=resource%3Aorg.bfore." + participantType + "%23" + ownerId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  getFundCampaignByDonor(donorId){
    var url = "http://localhost:3000/api/queries/Q7?donor=resource%3Aorg.bfore.Donor%23" + donorId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }



  getMissionsByCampaign(campaignId){
    var url = "http://localhost:3000/api/queries/Q8?campaign=resource%3Aorg.bfore.Campaign%23" + campaignId; 
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  getCampaignById(campaignId){
    var url = "http://localhost:3000/api/Campaign/" + campaignId; 
    return this.http.get(url, {withCredentials: true})
      .toPromise()
      .then((data) => {
        return data;
      });
  }

  addMissionToCampaign(data){
    var url = "http://localhost:3000/api/AddMissionToCampaign"; 
    return this.http.post(url, {
      $class: NS + 'AddMissionToCampaign',
      missionName: data['missionName'],
      missionDescription: data['missionDescription'],
      completeCampaign: data['completeCampaign'],
      bonusEducoin: data['bonusEducoin'],
      maxStudents: data['maxStudents'],
      mentorFare: data['mentorFare'],
      dueDate: data['dueDate'],
      activities: data['activities'],
      

    }, {withCredentials: true})
    .toPromise(); 
  }

  enrollStudentToMission(missionId){
    var mission = "resource:org.bfore.Mission#" + missionId ; 

    var url = "http://localhost:3000/api/EnrollStudentToMission"; 
    return this.http.post(url, {
      $class: NS + 'EnrollStudentToMission',
      mission: mission
    }, {withCredentials: true})
    .toPromise(); 
  }

  getMissionDetails(missionId){
    var url = "http://localhost:3000/api/Mission/" + missionId; 
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data;
     });
  }

  submitMission(missionContractId, file){
   
    var promise = this.getBase64(file);
    var a = this; 
   
    promise.then((result) => {
      console.log(result);
      var url = "http://localhost:3000/api/StudentSubmitMission"; 
      var missionContract = "resource:org.bfore.MissionContract#" + missionContractId ; 
      a.http.post(url, {
        $class: NS + 'StudentSubmitMission',
        missionContract: missionContract,
        filenames: [file['name']],
        attachments: [result]
      }, {withCredentials: true}).toPromise().then(() => {
        window.location.reload();
      })
      
      
    })
   
   
  }

  getContractsByMission(missionId){
    var url = "http://localhost:3000/api/queries/Q9?mission=resource%3Aorg.bfore.Mission%23" + missionId; 
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  evaluateMission(missionContractId, data){
    var missionContract = "resource:org.bfore.MissionContract#" + missionContractId ; 

    var url = "http://localhost:3000/api/StudentCompleteMission"; 
    return this.http.post(url, {
      $class: NS + 'StudentCompleteMission',
      missionContract: missionContract,
      completedActivities: data
    }, {withCredentials: true})
    .toPromise(); 
  }

  getMissionContractByMentor(mentorId){
    var url = "http://localhost:3000/api/queries/Q10?mentor=resource%3Aorg.bfore.Mentor%23" + mentorId;
    return this.http.get(url, {withCredentials: true}
      ).toPromise()
     .then((data) => { 
       return data; 
     });
  }

  mentorReview(missionContractId, file){
    var missionContract = "resource:org.bfore.MissionContract#" + missionContractId ; 
    var promise = this.getBase64(file);
    var a = this; 
    promise.then((result) => {
      //console.log(result);
      var url = "http://localhost:3000/api/MentorReview"; 
    
      a.http.post(url, {
        $class: NS + 'MentorReview',
        missionContract: missionContract,
        filenames: [file['name']],
        attachments: [result]
      }, {withCredentials: true}).toPromise().then(() => {
        window.location.reload();
      })
      
      
    })
   
   
  }

  askForMentor(missionContractId, mentorId, file){
    var missionContract = "resource:org.bfore.MissionContract#" + missionContractId ;
    var mentor =  "resource:org.bfore.Mentor#" + mentorId ;

    var promise = this.getBase64(file);
    var a = this; 
   
    promise.then((result) => {
      //console.log(result);
      var url = "http://localhost:3000/api/StudentAskForMentor"; 
    
      a.http.post(url, {
        $class: NS + 'StudentAskForMentor',
        missionContract: missionContract,
        filenames: [file['name']],
        attachments: [result],
        mentor: mentor
      }, {withCredentials: true}).toPromise().then(() => {
        window.location.reload();
      })
      
      
    })
  }
   
  

  leaveReview(missionContractId, data){
    var missionContract = "resource:org.bfore.MissionContract#" + missionContractId ;
    var url = "http://localhost:3000/api/StudentLeaveReview"; 
    return this.http.post(url, {
      $class: NS + 'StudentLeaveReview',
      missionContract: missionContract,
      review: {"$class": "org.bfore.Review",
                "title": data['title'],
                "description": data['description'],
                "score": data['score']}
     
    }, {withCredentials: true})
    .toPromise(); 
  }

  getBase64(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
    
    
 }
 

 


