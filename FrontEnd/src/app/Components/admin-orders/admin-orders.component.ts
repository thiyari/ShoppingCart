import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../service/aggregation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
    aggregation: any[] = []
    filteredResult: any[] = []
    searchText: string = "";
    constructor(
      private transactions: AggregationService,
      private http: HttpClient, 
      private router: Router
    ){}

    ngOnInit(): void {
      this.http.get<any>(`${environment.SERVER_URI}/api/session`)
      .subscribe((res)=>{
            if(res.valid){
                if (res.log_status === "admin") {
                  this.aggregation = this.transactions.merge_admindata();
                  // sorting the result according to datetime in descending order
                  this.aggregation.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  // Below is an Alternative method for the same
                  //var result = this.aggregation.sort((a:any,b:any)=>b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0)
                  this.transactions.setData(this.aggregation) 
                  this.search();
              }
            } else {
              this.router.navigate(['/login'])
            }
      })
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
    this.filteredResult = this.searchText === "" ? this.aggregation : this.aggregation.filter((item:any) => {
      return (
        item.referenceid.toLowerCase().includes(this.searchText.toLowerCase()) ||
        JSON.stringify(item.orderid).includes(this.searchText)
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
