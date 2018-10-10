import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';


const API_URL = environment.apiUrl;
const NS = "org.bfore.";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { 
  }

  private extractData(res: Response){
    let body = res; 
    return body || {};
  }

  getCampaigns(): Observable<any> {
    return this.http.get(API_URL + 'Campaign').pipe(
      map(this.extractData)
    );
  }

  getActivities(): Observable<any> {
    return this.http.get(API_URL + 'Activity').pipe(
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

  
  checkWallet(){
    return this.http.get('http://localhost:3000/api/wallet',
     {withCredentials: true}).toPromise();
  }

  getCurrentUser(){
    return this.http.get('http://localhost:3000/api/system/ping', {withCredentials:
  true}).toPromise()
    .then((data) => {
      return data; 
    }); 
  }

}
