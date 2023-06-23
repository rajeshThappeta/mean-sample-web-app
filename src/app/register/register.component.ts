import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  userRegistrationForm: FormGroup;
  errorMsg:string;
  file;

  constructor(private us:UserService,private router:Router){}

  ngOnInit(){
      this.userRegistrationForm=new FormGroup({
        username:new FormControl(''),
        password:new FormControl(''),
        email:new FormControl(''),
        photo:new FormControl('')
      })
  }


  onImageSelect(event){
   this.file=event.target.files[0]
   console.log(this.file)
  }


  registerUser(){
    let newUser=this.userRegistrationForm.value;

    //create FormData object
    let formData=new FormData()
    //add selected image
    formData.append('photo',this.file)
    //add newUser
    formData.append('newUser',JSON.stringify(newUser))
   
    this.us.createUser(formData).subscribe({
      next:(res)=>{
     
        if(res['message']==='created'){
          this.errorMsg='';
          //navigate to login
          this.router.navigate(['/login'])
        }
        else{
          this.errorMsg=res['message']
        }
      },
      error:(err)=>{console.log(err)}
    })
  }

 
}
