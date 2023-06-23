import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit{

  userLoginStatus:boolean;
  constructor(private us:UserService){}

  ngOnInit(): void {
    this.us.getDetailsOfCurrentUser().subscribe({
      next:(userDetails)=>{
        this.userLoginStatus=userDetails['userLoginStatus']
      }
    })
  }

  logOut(){
    //remove token from local/session storage
    localStorage.removeItem('token')
    //reset user status
    this.us.setDetailsOfCurrentUser({currentUser:{},userLoginStatus:false})
  }
}
