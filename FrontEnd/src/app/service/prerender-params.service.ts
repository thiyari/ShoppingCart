import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AggregationService } from './aggregation.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrerenderParamsService {

  product_ids:any[] = [];
  admin_ids:any[] = [];
  order_ids:any[] = [];
  phonepe_txn_ids:any[] = [];
  googlepay_txn_ids:any[] = [];
  razorpay_txn_ids:any[] = [];
  paypal_txn_ids:any[] = [];
  payment_referenceids:any[] = [];

  constructor(private api:ApiService, private transactions: AggregationService) { }

  async edit_admin(){
    const admins_list = await fetch(`${environment.SERVER_URI}/api/admins`)
    const admins_response = await admins_list.json()
    admins_response.records.map((x:any)=>this.admin_ids.push(x._id))

    return Promise.resolve(this.admin_ids)
  }

  async product() {
    const products_list = await fetch(`${environment.SERVER_URI}/api/products`)
    const products_response = await products_list.json()
    products_response.records.map((x:any)=>this.product_ids.push(JSON.stringify(x.pid)))

    return Promise.resolve(this.product_ids)
 }

  async orders() {
    const orders_list = await fetch(`${environment.SERVER_URI}/api/orders`)
    const orders_list_response = await orders_list.json()
    orders_list_response.records.map((x:any)=>this.order_ids.push(JSON.stringify(x.orderid)))

    return Promise.resolve(this.order_ids)
  }

  async phonepe_txn(){
    const phonepe_list = await fetch(`${environment.SERVER_URI}/api/phonepetxn`)
    const phonepe_response = await phonepe_list.json()
    phonepe_response.records.map((x:any)=>this.phonepe_txn_ids.push(x.referenceid))

    return Promise.resolve(this.phonepe_txn_ids)
  }

  async googlepay_txn(){
    const googlepay_list = await fetch(`${environment.SERVER_URI}/api/googlepaytxn`)
    const googlepay_response = await googlepay_list.json()
    googlepay_response.records.map((x:any)=>this.googlepay_txn_ids.push(x.referenceid))

    return Promise.resolve(this.googlepay_txn_ids)
  }

  async razorpay_txn(){
    const razorpay_list = await fetch(`${environment.SERVER_URI}/api/razorpaytxn`)
    const razorpay_response = await razorpay_list.json()
    razorpay_response.records.map((x:any)=>this.razorpay_txn_ids.push(x.referenceid))

    return Promise.resolve(this.razorpay_txn_ids)
  }

  async paypal_txn(){
    const paypal_list = await fetch(`${environment.SERVER_URI}/api/paypaltxn`)
    const paypal_response = await paypal_list.json()
    paypal_response.records.map((x:any)=>this.paypal_txn_ids.push(x.referenceid))

    return Promise.resolve(this.paypal_txn_ids)
  }

  async payment_txn(){
    const orders_list = await fetch(`${environment.SERVER_URI}/api/orders`)
    const orders_list_response = await orders_list.json()
    orders_list_response.records.filter((item:any)=>(item.transactionstatus != "pending"))
    .map((x:any)=>this.payment_referenceids.push(x.referenceid))
    return Promise.resolve(this.payment_referenceids)
  }
}
