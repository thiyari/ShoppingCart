import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router) { }

  getProducts(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/products`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  addProduct(bodyData:any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/products/create`,bodyData)
    .subscribe()
  }

  submit_order(bodyData: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/orders/create`,bodyData)
    .subscribe(()=>{
      const order_id = bodyData.orderid
      this.router.navigate(['/payment/'+ order_id])
    })
  }

  add_admin(bodyData: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/admins/create`,bodyData)
    .subscribe((res:any)=>{
      if(res.status){
        alert(res.message)
      } else {
        alert(res.message)
      }
    });
  }

  edit_admin(bodyData: any, id: any){
    return this.http.put<any>(`${environment.SERVER_URI}/api/admins/edit/${id}`,bodyData)
    .subscribe((res:any)=>{
      if(res.status){
        alert(res.message)
      } else {
        alert(res.message)
      }
    });    
  }

  edit_product(bodyData: any, id: any){
    return this.http.put<any>(`${environment.SERVER_URI}/api/product/edit/${id}`,bodyData)
    .subscribe((res:any)=>{
      if(res.status){
        alert(res.message)
      } else {
        alert(res.message)
      }
    });   
  }

  getOrders(){
     return this.http.get<any>(`${environment.SERVER_URI}/api/orders`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  getAdmins(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/admins`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  getDollarCurrency(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/fetch/dollar-factor`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  setDollarCurrency(data: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/dollar-factor`,data)
    .subscribe((res:any)=>{
      if(res.status){
        alert(res.message)
      } else {
        alert(res.message)
      }
    })
  }

  phonepe(data: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/phonepe`,data)
    .subscribe((response)=>{
        if(response.data && response.data.instrumentResponse.redirectInfo.url){
          window.location.href = response.data.instrumentResponse.redirectInfo.url;
        }
        return window.location.href
    })
  }

  googlepay(data: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/googlepay`,data)
    .subscribe()
  }

  paypal_pay(data: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/paypal-pay`,data)
    .subscribe()
  }

  razorpay_pay(data: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/razorpay-pay`,data)
    .subscribe()
  }

  phonepe_txn(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/phonepetxn`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  googlepay_txn(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/googlepaytxn`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  paypal_txn(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/paypaltxn`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  razorpay_txn(){
    return this.http.get<any>(`${environment.SERVER_URI}/api/razorpaytxn`)
    .pipe(map((res)=>{
      return res;
    }))
  }

  delete_admin(id:any, name: any){
    var result: any;
    if (window.confirm(`Are you sure deleting the admin: ${name} ?`)){
      try{
        result = this.http.delete<any>(`${environment.SERVER_URI}/api/admins/delete/${id}`)
        .subscribe()
      }
      catch (err) {
        alert(err)
      }
    }
    return result
  }

  delete_product(id:any, pid: any){
    var result: any;
    if (window.confirm(`Are you sure deleting the product# ${pid} ?`)){
      try{
        result = this.http.delete<any>(`${environment.SERVER_URI}/api/product/delete/${id}`)
        .subscribe()
      }
      catch (err) {
        alert(err)
      }
    }
    return result
  }

  
  delete_image(id:any, body: any){

    var result: any;
    const url = `${environment.SERVER_URI}/api/image/delete/${id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body
    };

    if (window.confirm(`Are you sure deleting the current Image ?`)){
      try{
        this.http.delete<any>(url,options).subscribe()
        window.location.reload();
      }
      catch (err) {
        alert(err)
      }
    }
    return result
  }


  upload_images(id:any, body:any){
    return this.http.put<any>(`${environment.SERVER_URI}/api/images/upload/${id}`,body)
    .subscribe((res:any)=>{
      if(res.status){
        alert(res.message)
        window.location.reload();
      } else {
        alert(res.message)
        window.location.reload();
      }
    }); 
  }

  update_show(id: any, bodyData: any){
    return this.http.put<any>(`${environment.SERVER_URI}/api/product/display/${id}`,bodyData)
    .subscribe((res:any)=>{
      if(res.status){
        console.log(res.message)
      } else {
        console.log(res.message)
      }
    });    
  }

  send_mail(bodyData: any){
    return this.http.post<any>(`${environment.SERVER_URI}/api/send-email`,bodyData)
    .subscribe((res:any)=>{
      if(res.status){
        alert(res.message)
      } else {
        alert(res.message)
      }
    });
  }

  update_delivery(bodyData: any, orderid: any){
    return this.http.put<any>(`${environment.SERVER_URI}/api/delivery/update/${orderid}`,bodyData)
    .subscribe(); 
  }

  delete_order(orderid:any){
    var result: any;
    if (window.confirm(`Are you sure deleting the Order# ${orderid}`)){
      try{
        result = this.http.delete<any>(`${environment.SERVER_URI}/api/order/delete/${orderid}`)
        .subscribe()
      }
      catch (err) {
        alert(err)
      }
    }
    return result
  }
  
  delete_record(orderid:Number, referenceid:string, transactionstatus: string){
    var result: boolean = false;
    if (window.confirm(`Are you sure deleting the Order# ${orderid}`)){
        if (transactionstatus === "Received: PayPal") {
          try{      
            const res1 = this.http.delete<any>(`${environment.SERVER_URI}/api/order/delete/${orderid}`).subscribe()
            const res2 = this.http.delete<any>(`${environment.SERVER_URI}/api/paypal/delete/${referenceid}`).subscribe()
            if (res1 && res2) {
              result = true
            } else {
              result = false
            }  
          }
          catch (err) {
            alert(err)
          }
        }
        else if (transactionstatus === "Received: Razorpay") {
          try{
            const res1 = this.http.delete<any>(`${environment.SERVER_URI}/api/order/delete/${orderid}`).subscribe()
            const res2 = this.http.delete<any>(`${environment.SERVER_URI}/api/razorpay/delete/${referenceid}`).subscribe()
            if (res1 && res2) {
              result = true
            } else {
              result = false
            }  
          }
          catch (err) {
            alert(err)
          }
        }
        else if (transactionstatus === "Received: PhonePe") {
          try{
            const res1 = this.http.delete<any>(`${environment.SERVER_URI}/api/order/delete/${orderid}`).subscribe()
            const res2 = this.http.delete<any>(`${environment.SERVER_URI}/api/phonepe/delete/${referenceid}`).subscribe()
            if (res1 && res2) {
              result = true
            } else {
              result = false
            }  
          }
          catch (err) {
            alert(err)
          }
        }
        else if (transactionstatus === "Received: GooglePay") {
          try{
            const res1 = this.http.delete<any>(`${environment.SERVER_URI}/api/order/delete/${orderid}`).subscribe()
            const res2 = this.http.delete<any>(`${environment.SERVER_URI}/api/googlepay/delete/${referenceid}`).subscribe()
            if (res1 && res2) {
              result = true
            } else {
              result = false
            }
          } 
          catch (err) {
            alert(err)
          }
        }

    }
    return result
  }
}
