import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-new-admin',
  standalone: false,
  
  templateUrl: './new-admin.component.html',
  styleUrl: './new-admin.component.scss'
})
export class NewAdminComponent implements OnInit{

  name: string = "";
  email: string = "";
  phone: string = "";
  
    constructor(     
      private api: ApiService,
      private http: HttpClient, 
      private router: Router
    ){}

  ngOnInit(): void {

    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
        if(res.valid){
          if (res.log_status === "user") {
            this.router.navigate(['/login'])
          }
        } else {
            this.router.navigate(['/login'])
        }
    })

  }

  add_admin(){
    if (this.name === "" || this.email === "" || this.phone === "" || this.phone.length != 10){
      alert("Please fill the fields")
    }
    else{
      let bodyData = {
        "name" : this.name,
        "email" : this.email,
        "phone": parseInt(this.phone),
    }
    this.api.add_admin(bodyData)
    this.name = "";
    this.email  = "";
    this.phone = "";
    }
  }

  logout(){
    this.http.get<any>(`${environment.SERVER_URI}/api/logout`)
        .subscribe((res)=>{
          if(res.valid){
            window.close();
          } else {
            alert("Logout Failed");
          }
        })
  }
}
