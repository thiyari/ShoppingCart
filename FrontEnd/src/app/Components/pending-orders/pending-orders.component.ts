import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-orders',
  standalone: false,
  
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.scss'
})
export class PendingOrdersComponent implements OnInit{
  orders_records: any;
  filteredResult: any[] = []
  searchText: string = "";
  constructor(
    private api: ApiService,
    private http: HttpClient, 
    private router: Router
  ){}

  ngOnInit(): void {

    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "admin") {
                this.api.getOrders()
                .subscribe(res=>{
                  if (res.message === "Success"){
                      var result = res.records.filter((item:any)=>item.transactionstatus === "pending")
                      this.orders_records = result.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      this.search();
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
      this.filteredResult = this.filteredResult.filter((item:any) => item.orderid != orderid);
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


  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  search() {
    this.filteredResult = this.searchText === "" ? this.orders_records : this.orders_records.filter((x:any) => {
      return (
        x.referenceid.toLowerCase().includes(this.searchText.toLowerCase()) ||
        JSON.stringify(x.orderid).includes(this.searchText)
      )
    });

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
