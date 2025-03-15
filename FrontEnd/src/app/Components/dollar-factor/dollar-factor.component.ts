import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-dollar-factor',
  standalone: false,
  
  templateUrl: './dollar-factor.component.html',
  styleUrl: './dollar-factor.component.scss'
})
export class DollarFactorComponent implements OnInit{
  dollar_factor: any;
  id: any;
  toggle: boolean = false;
  constructor(     
    private api: ApiService,
    private router: Router,
    private session: SessionStorageService
  ){}
  ngOnInit(): void {
    const res = this.session.getItem('userData');
        if (res != null || res != undefined) {
              if (res.log_status === "admin") {
                this.api.getDollarCurrency().subscribe((res:any)=>{
                  if(res.message === "Success"){
                    if(res.records.length === 0){
                      this.dollar_factor = 0;
                    } else {
                      this.id = res.records[0].id;
                      this.dollar_factor = res.records[0].USD
                    }
                  }
                })
            } 
          } else {
            this.router.navigate(['/login'])
          }

  }

  onEdit(){
    this.toggle = true;
  }
  onSubmit(){
    this.toggle = false;
    let body = {
      "key": 1,
      "USD": this.dollar_factor
    }
    this.api.setDollarCurrency(body)
  }

  logout(){
      this.session.clear()
      window.close()
    }  

}
