import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../service/aggregation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-deliveries',
  standalone: false,
  
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.scss'
})
export class DeliveriesComponent implements OnInit{
  filteredResult: any[] = []
  aggregation: any[] = []
  start_date: any;
  end_date: any;
    constructor(
      private api: ApiService,
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
                  // sorting the result according to datetime in ascending order
                  this.aggregation.sort((a:any, b:any) =>  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  // Below is an Alternative method for the descending order
                  //var result = this.aggregation.sort((a:any,b:any)=>b.createdAt < a.createdAt ? -1 : b.createdAt > a.createdAt ? 1 : 0)
                  this.transactions.setData(this.aggregation) 
                  this.search()
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

  convert_to_date(date: any){
    if (date === "pending") {
      return "pending"
    } else {
      return new Date(date).toLocaleDateString()
    }
  }

  onDelete(response: any){
    if(response.delivery.delivery_date != 'pending'){
      const order_id = response.orderid
      const reference_id = response.referenceid
      const transaction_status = response.transactionstatus
      const status = this.api.delete_record(order_id, reference_id, transaction_status)
      if(status){
        this.filteredResult = this.filteredResult.filter((item:any) => item.orderid != order_id);
      }
    } else {
      alert("Status not updated to 'Delivered', please update and try again")
    }
  }

  convert_timestamp_to_date(date:any){
    const day = (new Date(date).getDate()).toString().padStart(2, '0'); // month and day to always be a two-digit string 
    const month = (new Date(date).getMonth()+1).toString().padStart(2, '0'); // (note zero index: Jan = 0, Dec = 11)
    const year = new Date(date).getFullYear()
    return `${year}-${month}-${day}`
  }

  search(){
    this.filteredResult = ((this.start_date === undefined && this.end_date === undefined) || (this.start_date === "" && this.end_date === "")) ? this.aggregation : this.aggregation.filter((item:any) => {
      const converted_date = new Date(this.convert_timestamp_to_date(item.createdAt));
      return converted_date >= new Date(this.start_date) && converted_date <= new Date(this.end_date);
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
