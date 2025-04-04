import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  constructor(
    private http: HttpClient, 
    private api: ApiService,
    private session: SessionStorageService
    ){}

  display: boolean = false;
  email: any = "";
  otp_inputs: Array<string> = [];
  message: any = "";
  success: any = "";
  error: any = "";

  moveNext(event:any){
            // otp_num_4
            let current = event.target;
            let index = current.classList[1].slice(-1);

            // Shifting the key focus while pressing back space key (code 8)
            if (event.keyCode === 8 && index > 1) {
                current.previousElementSibling.focus()
                current.previousElementSibling.value = ""
            }
            // Shifting the key focus to next field while entering key
            else if (index < 6) {
                current.nextElementSibling.focus()
            }
            var otp_check = ""
            for (let num of this.otp_inputs) {
                otp_check += num
            }
            if (otp_check.length === 6) {
                this.verifyOTP(otp_check)
            }

  }

  verifyOTP(otp_check:any){
    let body = {
        "email": `${this.email}`,
        "otp": `${otp_check}`,
        "log_status": "user"
    }
    this.http.post<any>(`${environment.SERVER_URI}/api/verify-otp`,body)
    .subscribe((res)=>{
        if(res.status){
            this.session.setItem("userData", {email: this.email, log_status: "user"}, 15)
            this.display = false;
            this.email = "";
            this.success = "OTP verified Successfully";
            this.error = "";
            window.open("/user-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
        } else {
            this.display = false;
            this.email = "";
            this.error = "Invalid OTP, Please try again...";
            this.success = "";            
        }
    })
  }

  sendOTP() {
    let email_distinct = new Set<any>();
    this.success = "";
    this.error = "";
    this.otp_inputs = [];
    let regex = new RegExp('[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (regex.test(this.email)) {

        // check email with the database
        this.api.getOrders()
        .subscribe(res=>{
          if (res.message === "Success"){
                let records = res.records.filter((item:any)=>item.email===this.email)
                let emails = records.map((x:any)=>x.email)
                emails.forEach((x:any)=>email_distinct.add(x))
            }

            if (email_distinct.values().next().value === this.email){

                let body = {
                    "email": `${this.email}`
                }
                this.http.post<any>(`${environment.SERVER_URI}/api/send-otp`,body)
                .subscribe((res)=>{
                    if (res.status) {
                        this.display = true;
                        this.message = "An OTP has been sent to ***" + this.email.slice(3)
                    }
                    else {
                        this.error = "Email not exist";
                        this.success = "";
                    }
                })        

            } else {
                this.error = "Email doesn't exist in the database records";
                this.success = "";
            }
          })
        
        }
        else {
            this.error = "Email entered is invalid";
            this.success = "";
        }
  }

}
