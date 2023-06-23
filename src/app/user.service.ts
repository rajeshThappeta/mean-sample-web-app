import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserService {

  currentUsersSubject=new BehaviorSubject({})

  //read data of BS
  getDetailsOfCurrentUser(){
    return this.currentUsersSubject.asObservable()
  }
  //update BH
  setDetailsOfCurrentUser(currentUserDeatils){
    this.currentUsersSubject.next(currentUserDeatils)
  }


  constructor(private hc: HttpClient) {}

  createUser(formData:any) {
    return this.hc.post('http://localhost:4000/user-api/user',formData);
  }

  userLogin(userCredObj:any){
    return this.hc.post('http://localhost:4000/user-api/user-login',userCredObj);
  }
}
