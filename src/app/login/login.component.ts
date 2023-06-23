import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  userLoginForm: FormGroup;
  errorMsg:string;

  constructor(private us:UserService,private router:Router){}

  ngOnInit(){
      this.userLoginForm=new FormGroup({
        username:new FormControl(''),
        password:new FormControl(''),
       
      })
  }


  loginUser(){
    let userCredObj=this.userLoginForm.value;
   
    this.us.userLogin(userCredObj).subscribe({
      next:(res)=>{
     
        if(res['message']==='Login success'){
          this.errorMsg='';

          //save token in browser memory(local storage)
          localStorage.setItem('token',res['token'])
          //update BehaviourSubject with current user details
          this.us.setDetailsOfCurrentUser({currentUser:res['currentUser'],userLoginStatus:true})
          //navigate to login
          this.router.navigate(['/user-profile'])
        }
        else{
          this.errorMsg=res['message']
        }
      },
      error:(err)=>{console.log(err)}
    })
  }
}
