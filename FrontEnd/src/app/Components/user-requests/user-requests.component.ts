import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

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
    private http: HttpClient, 
    private router: Router
  ){}

  ngOnInit(): void {


    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
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
    })
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
