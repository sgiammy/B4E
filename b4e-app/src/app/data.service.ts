import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject('false');
  currentMessage = this.messageSource.asObservable();

  private isCampaign = new BehaviorSubject('false');
  currentIsCampaign = this.isCampaign.asObservable();  

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  changeIsCampaign(message: string){
    this.isCampaign.next(message);
  }
}
