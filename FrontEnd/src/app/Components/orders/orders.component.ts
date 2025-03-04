import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{

name: string ="";
email: string ="";
phone: string="";
address: string ="";
city: string ="";
state: string="";
country: string = "";
pin: string="";
public products: any = [];
public grandTotal !: number ;

constructor(private api: ApiService, private cartService: CartService){}
  ngOnInit(): void {
    this.cartService.getProducts()
    .subscribe(res=>{
      this.products = res;
      this.grandTotal = this.cartService.getTotalPrice();
    })
  }

order_submit(){
  if (this.name === "" || this.email === "" || this.phone === "" || this.phone.length != 10 || this.address === "" || this.city === "" || this.state === "" || this.country === "" || this.pin === ""){
    alert("Please fill the fields")
  }
  else{
    const currDate = new Date().toLocaleDateString();
    const currTime = new Date().toLocaleTimeString();
    const datetime = currDate+currTime
    const random_digits = datetime.replace(/[^0-9]/g, "")
    const orderid = Math.floor(10 + Math.random() * 90)+random_digits;
    let bodyData = {
      "orderid": orderid,
      "name" : this.name,
      "email" : this.email,
      "phone": parseInt(this.phone),
      "shippingaddress": this.address,
      "city": this.city,
      "state": this.state,
      "country": this.country,
      "pin": this.pin,
      "ordersplaced":this.products,
      "grandtotal":this.grandTotal,
      "referenceid": 'T' + Date.now(),
      "transactionstatus":"pending",
      "delivery": {
        "status": "Order Confirmed",
        "expected_date": "pending",
        "delivery_date": "pending",
        "tracking_id": "pending"
      }
    };
    this.api.submit_order(bodyData)
    this.name = "";
    this.email  = "";
    this.phone = "";
    this.address = "";    
    this.city = "";
    this.state = "";
    this.country = "";
    this.pin = "";
  }
}
}
