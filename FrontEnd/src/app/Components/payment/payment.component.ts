import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { LocalService } from '../../service/local.service';
import { WindowRefService } from '../../window-ref.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment',
  standalone: false,
  
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  providers: [WindowRefService]
})
export class PaymentComponent implements OnInit{

  public orders: any;
  Razorpay: any;

  constructor(
    private api: ApiService, 
    private route: ActivatedRoute,
    private localStore: LocalService,
    private winRef: WindowRefService
  ){}

  ngOnInit(): void {
    const order_id = this.route.snapshot.params['orderid'];
    this.api.getOrders()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.orders = res.records.find((item:any)=>
          JSON.stringify(item.orderid) === order_id
        );
      }
      this.localStore.saveData('orderid', this.orders?.orderid);
      this.localStore.saveData('name', this.orders?.name);
      this.localStore.saveData('email', this.orders?.email);
      this.localStore.saveData('referenceid', this.orders?.referenceid);
      this.localStore.saveData('amount', this.orders?.grandtotal);
    })
  }
  phonepe_payment(){
    let data = {
      orderid: this.orders.orderid,
      email: this.orders.email,
      name: this.orders.name,
      amount: this.orders.grandtotal,
      phone: this.orders.phone,
      merchantUserID: "MUID" + Date.now(),
      merchantTransactionID: this.orders.referenceid
    }
    this.api.phonepe(data)
  }

  razorpay_payment(){
    const key = environment.RAZOR_PAY_KEY
    const order_id = this.orders.orderid;
    const referenceid = this.orders.referenceid;
    const amount = this.orders.grandtotal
    const name = this.orders.name
    const email = this.orders.email
    const phone = this.orders.phone
    const send_mail =  (email_body: any) => {
      return this.api.send_mail(email_body)
    }
    const razorpay_data = (body:any) => {
      return this.api.razorpay_pay(body)
    }
    const RozarpayOptions = {
      key: key,
      amount: (amount*100).toFixed(2),
      currency: 'INR',
      description: 'Sample Razorpay demo',
      image: 'https://4.imimg.com/data4/HS/BK/MY-146693/temporary-tattoos-en71-approved-500x500.jpg',
      name: "Services",
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      handler: function(response:any){
        let body = {
          referenceid: referenceid,
          transactionid: response.razorpay_payment_id,
          amount: amount
        }
        razorpay_data(body);
        let email_body = {
          to: email,
          subject: `Reg: Payment Order# ${order_id}`,
          html: `        
            <P>Dear ${name},</p>
            <p>We are very glad that you have choosen our ${environment.COMPANY_NAME} Services, we hereby inform you that your payment process was successful for the requested <b>order #${order_id}</b>. To download invoice, please login to our website with your registered email.</p>
            <p>Regards,</p>
            <p>Admin</p>`
        }
        send_mail(email_body);
        window.location.href = `${environment.CLIENT_URI}/razorpaytxn/${referenceid}`
        return window.location.href
      },
      notes: {
        address: 'Razorpay address'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss:  function() {
          console.log('Transaction Cancelled')
        }
      },
    }

    const rzp = new this.winRef.nativeWindow.Razorpay(RozarpayOptions);
    
    rzp.on('payment.failed',function(response:any){
      alert(`Payment failed Reason: ${response.error.description}`);
    });

    rzp.open();
  }
}
