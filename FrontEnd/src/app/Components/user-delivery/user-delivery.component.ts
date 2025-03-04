import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-user-delivery',
  standalone: false,
  
  templateUrl: './user-delivery.component.html',
  styleUrl: './user-delivery.component.scss'
})
export class UserDeliveryComponent implements OnInit{
  orderid: any;
  toggle: boolean = false;
  records: any;
  status: any;
  expected_date: any;
  delivery_date: any;
  tracking_id: any;
    constructor(
      private http: HttpClient,
      private router: Router,
      private api: ApiService
    ){}
    
  ngOnInit(): void {
        this.http.get<any>(`${environment.SERVER_URI}/api/session`)
        .subscribe((res)=>{
              if(res.valid){
                  if (res.log_status === "user") {
                      this.api.getOrders().subscribe((res:any)=>{
                        if (res.message === 'Success'){
                          this.records = res.records
                        }
                      })         
                }
              } else {
                this.router.navigate(['/login'])
              }
        })
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

  onSubmit(){
    const result = this.records.find((res:any)=>res.orderid === parseInt(this.orderid))
    if(result){
      this.toggle = true;
      this.status = result.delivery.status;
      this.tracking_id = result.delivery.tracking_id;
      this.expected_date = result.delivery.expected_date === "pending"? "pending" : new Date(result.delivery.expected_date).toLocaleDateString();
      this.delivery_date = result.delivery.delivery_date === "pending"? "pending" : new Date(result.delivery.delivery_date).toLocaleDateString();
    } else {
      this.toggle = false;
      alert("Record not found")
    }
  }

}
