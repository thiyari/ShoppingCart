import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {

  orders_records: any[] = [];
  reference_ids:any[] = [];
  paypal_records:any[] = [];
  razorpay_records: any[] = [];
  phonepe_records: any[] = [];
  googlepay_records: any[] = []
  aggregation: any[] = []
  result: any[] = [];

  constructor(private api: ApiService) { }

  merge_result(reference_ids: any, orders_records: any){

    this.api.paypal_txn()
      .subscribe(res=>{
        if (res.message === "Success"){
          for (let i = 0; i < reference_ids.length; i++){
            res.records.map((item:any)=>{
              if(item.referenceid === reference_ids[i]){
                this.paypal_records.push(item)
              }
            })
          }
          }
        });


    this.api.razorpay_txn()
        .subscribe(res=>{
          if (res.message === "Success"){
            for (let i = 0; i < reference_ids.length; i++){
              res.records.map((item:any)=>{
                if(item.referenceid === reference_ids[i]){
                  this.razorpay_records.push(item)
                }
              })
            }
            }
          });

    this.api.phonepe_txn()
          .subscribe(res=>{
            if (res.message === "Success"){
              for (let i = 0; i < reference_ids.length; i++){
                res.records.map((item:any)=>{
                  if(item.referenceid === reference_ids[i]){
                    this.phonepe_records.push(item)
                  }
                })
              }
              }
            });

    this.api.googlepay_txn()
            .subscribe(res=>{
              if (res.message === "Success"){
                for (let i = 0; i < reference_ids.length; i++){
                  res.records.map((item:any)=>{
                    if(item.referenceid === reference_ids[i]){
                      this.googlepay_records.push(item)
                    }
                  })
                }
                }
              });
  

      let mergedPaypal = this.paypal_records.map((paypal:any) => {
          let ordersArray = orders_records.find((orders:any) => orders.referenceid === paypal.referenceid);
          return Object.assign({}, ordersArray, paypal);
      });


      let mergedRazorpay = this.razorpay_records.map((razorpay:any) => {
        let ordersArray = orders_records.find((orders:any) => orders.referenceid === razorpay.referenceid);
        return Object.assign({}, ordersArray, razorpay);
      });      

      let mergedPhonepe = this.phonepe_records.map((phonepe:any) => {
        let ordersArray = orders_records.find((orders:any) => orders.referenceid === phonepe.referenceid);
        return Object.assign({}, ordersArray, phonepe);
      });    

      
      let mergedGooglepay = this.googlepay_records.map((googlepay:any) => {
        let ordersArray = orders_records.find((orders:any) => orders.referenceid === googlepay.referenceid);
        return Object.assign({}, ordersArray, googlepay);
      });

      this.aggregation = [...mergedPaypal,...mergedRazorpay,...mergedPhonepe,...mergedGooglepay]

      // Removing duplicates if exists in the aggregation result
      let distinct_aggregation = this.aggregation.filter((obj, index, self) =>
        index === self.findIndex((t) => (
            t.orderid === obj.orderid
        ))
      );
      
      //return this.aggregation
      return distinct_aggregation
  }

  merge_userdata(mail_id: any){

    this.api.getOrders()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.orders_records = res.records.filter((item:any)=>item.email===mail_id)
        this.orders_records.map((x:any)=>this.reference_ids.push(x.referenceid))
        }
      })

    let user_result = this.merge_result(this.reference_ids, this.orders_records);
    this.reference_ids = []
    this.orders_records = []
    
    return user_result
  }

  merge_admindata(){
    this.api.getOrders()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.orders_records = res.records
        this.orders_records.map((x:any)=>this.reference_ids.push(x.referenceid))
        }
      })

    let admin_result = this.merge_result(this.reference_ids, this.orders_records);
    this.reference_ids = []
    this.orders_records = []

    return admin_result    
  }


  setData(response: any) {
    this.result = response
  }

  getData() {
    return this.result
  }

  clearData() {
    return this.result = []
  }
}

