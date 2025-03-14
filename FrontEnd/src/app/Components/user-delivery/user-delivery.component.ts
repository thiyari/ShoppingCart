import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SessionStorageService } from '../../service/session-storage.service';

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
      private router: Router,
      private api: ApiService,
      private session: SessionStorageService
    ){}
    
  ngOnInit(): void {

    const res = this.session.getItem('userData');

                  if (res.log_status === "user") {
                      this.api.getOrders().subscribe((res:any)=>{
                        if (res.message === 'Success'){
                          this.records = res.records
                        }
                      })         
                } else {
                this.router.navigate(['/login'])
              }
  
  }

  logout(){
    this.session.clear();
    window.close();
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
