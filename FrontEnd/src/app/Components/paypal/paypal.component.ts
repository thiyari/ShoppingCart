import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { LocalService } from '../../service/local.service';

@Component({
  selector: 'app-paypal',
  standalone: false,
  
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.scss'
})
export class PaypalComponent implements OnInit{
  public dollar_factor: any;
  public orders: any;
  public payPalConfig?: IPayPalConfig;

  constructor(
    private api: ApiService, 
    private localStore: LocalService
){}

  ngOnInit(): void {
    const order_id = this.localStore.getData("orderid")
    this.orders = this.api.getOrders()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.orders = res.records.find((item:any)=>
          JSON.stringify(item.orderid) === order_id
        );
      }
    })
    this.api.getDollarCurrency().subscribe((res:any)=>{
        if(res.message === "Success"){
          if(res.records.length === 0){
            this.dollar_factor = 0;
          } else {
            this.dollar_factor = res.records[0].USD
          }
        }
      })
    this.initConfig();
  }


    grandtotal(){
        let values:number[] = [];
        this.orders.ordersplaced?.forEach((x:any)=>{
            const product = +(x.price*this.dollar_factor).toFixed(2)
            const result = +(x.quantity * product).toFixed(2)
            values.push(result);
        })
        let grandTotal: number = values.reduce((a, b) => {  
            return +(a + b).toFixed(2);  
        }, 0); 
        return grandTotal
    }    


  private initConfig(): void {
    const currency = "USD";
    this.payPalConfig = {
        currency: currency,
        clientId: environment.PAYPAL_CLIENT_ID,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: this.grandtotal().toString(),
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: this.grandtotal().toString()
                        }
                    }
                },
                items: this.orders.ordersplaced.map((x:any) => <ITransactionItem>{
                    name: x.name,
                    quantity: x.quantity,
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: currency,
                        value: (+(x.price*this.dollar_factor).toFixed(2)).toString(),
                    },
                })
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then((details:any) => {

                let product_items:any[] = []
                let purchase_response = details.purchase_units.find((x:any)=>x)
                purchase_response.items.map((item:any)=>{
                    product_items.push({
                        "product_name": item.name,
                        "price": item.unit_amount.value,
                        "quantity": parseInt(item.quantity),
                        "total_price": +(item.unit_amount.value * item.quantity).toFixed(2).toString()
                    })
                })
                if (details.status === "COMPLETED"){
                    let body ={
                        referenceid: this.orders.referenceid,
                        transactionid: details.id,
                        transaction_date: details.create_time,
                        items: product_items,
                        amount: purchase_response.amount.value,
                    }
                    this.api.paypal_pay(body)
                    let email_body = {
                        to: this.orders.email,
                        subject: `Reg: Payment Order# ${this.orders.orderid}`,
                        html: `        
                          <P>Dear ${this.orders.name},</p>
                          <p>We are very glad that you have choosen our ${environment.COMPANY_NAME} Services, we hereby inform you that your payment process was successful for the requested <b>order #${this.orders.orderid}</b>. To download invoice, please login to our website with your registered email.</p>
                          <p>Regards,</p>
                          <p>Admin</p>`
                      }
                    this.api.send_mail(email_body);
                }

                window.location.href = `${environment.CLIENT_URI}/paypaltxn/${this.orders.referenceid}`
            });

        },
        onError: err => {
            console.log('OnError', err);
        }
    };
}


}
