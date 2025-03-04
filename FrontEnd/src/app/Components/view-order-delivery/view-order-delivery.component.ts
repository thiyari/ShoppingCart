import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { AggregationService } from '../../service/aggregation.service';

@Component({
  selector: 'app-view-order-delivery',
  standalone: false,
  
  templateUrl: './view-order-delivery.component.html',
  styleUrl: './view-order-delivery.component.scss'
})
export class ViewOrderDeliveryComponent implements OnInit{
    success: any;
    error: any;
    order:any;
    options = ["Order Confirmed", "Out For Delivery", "Delivered"];
    optionSelected: any;
    tracking_id: any;
    expected_date: any;
    delivery_date: any;
    constructor(
          private api: ApiService,
          private route: ActivatedRoute,
          private http: HttpClient, 
          private router: Router,
          private transactions: AggregationService,
    ){}
  ngOnInit(): void {
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "admin") {
                const order_id = this.route.snapshot.params['orderid'];
                this.order = this.transactions.getData().find((item:any)=>JSON.stringify(item.orderid)===order_id)
                this.optionSelected = this.order.delivery.status
                this.expected_date = this.order.delivery.expected_date
                this.delivery_date = this.order.delivery.delivery_date
                this.tracking_id = this.order.delivery.tracking_id
              }
          } else {
            this.router.navigate(['/login'])
          }
    })  
  }

  onOptionsSelected(event: any){
    this.optionSelected = event; //option value will be sent as event
    }

  update(optionSelected:any){

    if (optionSelected === 'Order Confirmed'){
      let body = {
        "status": optionSelected,
        "expected_date": "pending",
        "tracking_id": "pending",
        "delivery_date": "pending",
      }
      this.api.update_delivery(body, this.order.orderid);
      this.success = "Updated the status to Order Confirmed"
      this.error = ""
    } 
    if (optionSelected === 'Out For Delivery'){
      if (optionSelected === 'Out For Delivery' && this.tracking_id === 'pending'){
        this.success = ""
        this.error = "Please enter the Tracking Id"
      } else if (optionSelected === 'Out For Delivery' && this.expected_date === 'pending') {
        this.success = ""
        this.error = "Please pick the expected date of delivery"
      } else {
        let body = {
          "status": optionSelected,
          "expected_date": this.expected_date,
          "tracking_id": this.tracking_id,
          "delivery_date": "pending"
        }
        this.api.update_delivery(body, this.order.orderid);
        let email_body = {
          to: this.order.email,
          subject: `Reg: Delivery status for your Order# ${this.order.orderid}`,
          html: `        
            <P>Dear ${this.order.name},</p>
            <p>This is to inform you that your <b>order #${this.order.orderid}</b> is out for delivery, your tracking id for your order is <b>${this.tracking_id}</b>. For any details you may please visit our website and login with your registered email.</p>
            <p>Regards,</p>
            <p>Admin</p>`
        }
        this.api.send_mail(email_body)
        this.success = "Out For Delivery status is updated successfully"
        this.error = ""
      }
    }  

    if (optionSelected === 'Delivered'){
      if(optionSelected === 'Delivered' && this.tracking_id === 'pending') {
        this.success = ""
        this.error = "Tracking id is pending, update the status 'Out For Delivery' and then try again";
      } else if(optionSelected === 'Delivered' && this.delivery_date === 'pending') {
        this.success = ""
        this.error = "please pick the delivery date";
      } else {
        let body = {
          "status": optionSelected,
          "expected_date": this.expected_date,
          "tracking_id": this.tracking_id,
          "delivery_date": this.delivery_date,
        }
        this.api.update_delivery(body, this.order.orderid);
        let email_body = {
          to: this.order.email,
          subject: `Reg: Delivery of your Order# ${this.order.orderid}`,
          html: `        
            <P>Dear ${this.order.name},</p>
            <p>This is to inform you that your <b>order #${this.order.orderid}</b> is successfully delivered with tracing id <b>${this.tracking_id}</b>. For any details you may please visit our website and login with your registered email.</p>
            <p>Regards,</p>
            <p>Admin</p>`
        }
        this.api.send_mail(email_body)
        this.success =  "Successfully updated the status to Delivered"
        this.error = ""
      }
    }
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
