import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../service/aggregation.service';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-deliveries',
  standalone: false,
  
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.scss'
})
export class DeliveriesComponent implements OnInit{

  aggregation_result: any[] = []
  orders_records: any[] = [];
  reference_ids:any[] = [];
  paypal_records:any[] = [];
  razorpay_records: any[] = [];
  phonepe_records: any[] = [];
  googlepay_records: any[] = []
  aggregation: any[] = []

  filteredResult: any[] = []
  start_date: any;
  end_date: any;

    constructor(
      private api: ApiService,
      private transactions: AggregationService,
      private router: Router,
      private session: SessionStorageService
    ){}  
  
  ngOnInit(): void {
      const res = this.session.getItem('userData');

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
                                    
                                    var result = this.aggregation_result.sort((a:any, b:any) =>  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
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

              } else {
              this.router.navigate(['/login'])
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
    this.filteredResult = ((this.start_date === undefined && this.end_date === undefined) || (this.start_date === "" && this.end_date === "")) ? this.aggregation_result : this.aggregation_result.filter((item:any) => {
      const converted_date = new Date(this.convert_timestamp_to_date(item.createdAt));
      return converted_date >= new Date(this.start_date) && converted_date <= new Date(this.end_date);
    });
  } 

  logout(){
    this.session.clear()
    window.close()
  }

}
