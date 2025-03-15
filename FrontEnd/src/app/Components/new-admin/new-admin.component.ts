import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SessionStorageService } from '../../service/session-storage.service';

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
      private router: Router,
      private session: SessionStorageService
    ){}

  ngOnInit(): void {
    const res = this.session.getItem('userData');
      
          if (res === null || res === undefined || res.log_status === "user") {
            this.router.navigate(['/login'])
          } 

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
    this.session.clear();
    window.close();
  }
}
