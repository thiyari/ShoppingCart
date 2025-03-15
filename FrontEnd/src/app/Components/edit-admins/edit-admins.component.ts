import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-edit-admins',
  standalone: false,
  
  templateUrl: './edit-admins.component.html',
  styleUrl: './edit-admins.component.scss'
})
export class EditAdminsComponent implements OnInit{

  id: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";

  constructor(     
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private session: SessionStorageService
  ){}

    ngOnInit(): void {
      const res = this.session.getItem('userData');
        if(res != null || res != undefined) {
            if (res.log_status === "admin") {
              this.id = this.route.snapshot.params['id'];
              this.api.getAdmins()
              .subscribe((res:any)=>{
                if (res.message === "Success"){
                    const record = res.records.find((item:any)=>item._id === this.id)
                    this.name = record.name;
                    this.email = record.email;
                    this.phone = JSON.stringify(record.phone);
                }
              }) 
            } 
          } else {
              this.router.navigate(['/login'])
          }
      
    }

  edit_admin(){
    if (this.name === "" || this.email === "" || this.phone === "" || this.phone.length != 10){
      alert("Please fill the fields")
    }
    else{
      let bodyData = {
        "name" : this.name,
        "email" : this.email,
        "phone": parseInt(this.phone),
      }
      this.api.edit_admin(bodyData, this.id)
    }
  }

    logout(){
      this.session.clear()
      window.close()
    }

}
