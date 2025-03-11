import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../service/aggregation.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
    
    aggregation_result: any[] = []
    orders_records: any[] = [];
    reference_ids:any[] = [];
    paypal_records:any[] = [];
    razorpay_records: any[] = [];
    phonepe_records: any[] = [];
    googlepay_records: any[] = []
    aggregation: any[] = []
    result: any[] = [];

    filteredResult: any[] = []
    searchText: string = "";
    
    constructor(
      private transactions: AggregationService,
      private http: HttpClient, 
      private router: Router,
      private api: ApiService
    ){}

    ngOnInit(): void {
      this.http.get<any>(`${environment.SERVER_URI}/api/session`)
      .subscribe(res=>{
            if(res.valid){
                if (res.log_status === "admin") {


                  this.api.getOrders()
                  .subscribe(res=>{
                    if (res.message === "Success"){
                      this.orders_records = res.records
                      this.orders_records.map((x:any)=>this.reference_ids.push(x.referenceid))
              
              
                      this.api.paypal_txn()
                      .subscribe(res=>{
                        if (res.message === "Success"){
                          for (let i = 0; i < this.reference_ids.length; i++){
                            res.records.map((item:any)=>{
                              if(item.referenceid === this.reference_ids[i]){
                                this.paypal_records.push(item)
                              }
                            })
                          }
              
                          this.api.razorpay_txn()
                          .subscribe(res=>{
                            if (res.message === "Success"){
                              for (let i = 0; i < this.reference_ids.length; i++){
                                res.records.map((item:any)=>{
                                  if(item.referenceid === this.reference_ids[i]){
                                    this.razorpay_records.push(item)
                                  }
                                })
                              }
              
                              this.api.phonepe_txn()
                              .subscribe(res=>{
                                if (res.message === "Success"){
                                  for (let i = 0; i < this.reference_ids.length; i++){
                                    res.records.map((item:any)=>{
                                      if(item.referenceid === this.reference_ids[i]){
                                        this.phonepe_records.push(item)
                                      }
                                    })
                                  }
              
              
              
                                  this.api.googlepay_txn()
                                  .subscribe(res=>{
                                    if (res.message === "Success"){
                                      for (let i = 0; i < this.reference_ids.length; i++){
                                        res.records.map((item:any)=>{
                                          if(item.referenceid === this.reference_ids[i]){
                                            this.googlepay_records.push(item)
                                          }
                                        })
                                      }
              
              
                                    let mergedPaypal = this.paypal_records.map((paypal:any) => {
                                        let ordersArray = this.orders_records.find((orders:any) => orders.referenceid === paypal.referenceid);
                                        return Object.assign({}, ordersArray, paypal);
                                    });
              
                                    let mergedRazorpay = this.razorpay_records.map((razorpay:any) => {
                                      let ordersArray = this.orders_records.find((orders:any) => orders.referenceid === razorpay.referenceid);
                                      return Object.assign({}, ordersArray, razorpay);
                                    });      
                              
                                    let mergedPhonepe = this.phonepe_records.map((phonepe:any) => {
                                      let ordersArray = this.orders_records.find((orders:any) => orders.referenceid === phonepe.referenceid);
                                      return Object.assign({}, ordersArray, phonepe);
                                    });    
                              
                                    
                                    let mergedGooglepay = this.googlepay_records.map((googlepay:any) => {
                                      let ordersArray = this.orders_records.find((orders:any) => orders.referenceid === googlepay.referenceid);
                                      return Object.assign({}, ordersArray, googlepay);
                                    });
                                              
              
                                    
                                    this.aggregation = [...mergedPaypal,...mergedRazorpay,...mergedPhonepe,...mergedGooglepay]
              
                                    // Removing duplicates if exists in the aggregation result
                                    this.aggregation_result = this.aggregation.filter((obj, index, self) =>
                                      index === self.findIndex((t) => (
                                          t.orderid === obj.orderid
                                      ))
                                    );
              
                                    this.reference_ids = []
                                    this.orders_records = []
                                    
                                    var result = this.aggregation_result.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    this.transactions.setData(result) 
                                    this.search();


                                      }
                                    }); // end googlepay subscription
              
              
                                  }
                                }); // end phonepe subscription
              
              
                              }
                            }); // end razorpay subscription
              
              
                          }
                        }); // end paypal subscription
              
              
                      }
                    }) // end orders subscription
                
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
    this.filteredResult = this.searchText === "" ? this.aggregation_result : this.aggregation_result.filter((item:any) => {
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
