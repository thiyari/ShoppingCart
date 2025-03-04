import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-view-request',
  standalone: false,
  
  templateUrl: './view-request.component.html',
  styleUrl: './view-request.component.scss'
})
export class ViewRequestComponent implements OnInit{
  public order:any;
  public log_status:any;
  constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private http: HttpClient, 
        private router: Router
  ){}

  ngOnInit(): void {


    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "user") {
                  this.log_status = "user"
              }
              else if (res.log_status === "admin") {
                  this.log_status = "admin"
              }
          } else {
            this.router.navigate(['/login'])
          }
    })
    const order_id = this.route.snapshot.params['orderid'];
    this.api.getOrders()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.order = res.records.find((item:any)=>JSON.stringify(item.orderid)===order_id)
        }
      })
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

  send_mail(order_id: any, name: any, email: any){
    const url = environment.CLIENT_URI+"/payment/"+order_id
    let body = {
      to: email,
      subject: `Reg: Pending Request Order# ${order_id}`,
      html: `        
        <P>Dear ${name},</p>
        <p>We are very glad that you have choosen our ${environment.COMPANY_NAME} Services, we hereby inform you that there was a pending request placed with an order# ${order_id} in our records. You may please visit this 
        <a href=${url} target="_blank">${url}</a> for further payment process. For any details, you may please login to our website with your registered email.</p>
        <p>Regards,</p>
        <p>Admin</p>`
    }
    this.api.send_mail(body);
  }
}
