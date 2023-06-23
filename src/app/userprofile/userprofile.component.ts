import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  currentUser={};

  confidentialData:string;
  constructor(private us:UserService,private hc:HttpClient){}

  ngOnInit(): void {
    this.us.getDetailsOfCurrentUser().subscribe({
      next:(userDetails)=>{
        console.log(userDetails)
        this.currentUser=userDetails['currentUser'];
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }


  getProtectedData(){
    this.hc.get('http://localhost:4000/user-api/test-private')
    .subscribe({
      next:(data)=>{
        this.confidentialData=data['message'];
      },
      error:(err)=>console.log(err)
    })
  }
}
