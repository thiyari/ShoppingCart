import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-user-requests',
  standalone: false,
  
  templateUrl: './user-requests.component.html',
  styleUrl: './user-requests.component.scss'
})
export class UserRequestsComponent implements OnInit{
  orders_records: any;
  constructor(
    private api: ApiService,
    private router: Router,
    private session: SessionStorageService
  ){}

  ngOnInit(): void {

    const res = this.session.getItem('userData');
    if (res != null || res != undefined){

              if (res.log_status === "user") {
                const email = res.email
                this.api.getOrders()
                .subscribe(res=>{
                  if (res.message === "Success"){
                      var result = res.records.filter((item:any)=>item.email===email && item.transactionstatus === "pending")
                      this.orders_records = result.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    }
                  })            
            } 
          } else {
            this.router.navigate(['/login'])
          }
  }

  onDelete(orderid:any){
    const status = this.api.delete_order(orderid)
    if(status){
      this.orders_records = this.orders_records.filter((item:any) => item.orderid != orderid);
    }
  }

  formatedDate = (savedTime:any) => {
    const date = new Date(savedTime).toLocaleString(
      "gu-IN",
      {
        timeStyle: "medium",
        dateStyle: "short",
      }
    );
    return date
  }

  logout(){
    this.session.clear();
    window.close();
  }

}
