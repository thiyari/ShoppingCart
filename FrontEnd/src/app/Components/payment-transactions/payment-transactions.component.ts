import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AggregationService } from '../../service/aggregation.service';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-payment-transactions',
  standalone: false,
  
  templateUrl: './payment-transactions.component.html',
  styleUrl: './payment-transactions.component.scss'
})
export class PaymentTransactionsComponent implements OnInit{

  record: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transactions: AggregationService,
    private session: SessionStorageService
  ){}

  ngOnInit(): void {
    const res = this.session.getItem('userData');

            if (res.log_status === "admin") {
                const reference_id = this.route.snapshot.params["referenceid"]; 
                this.record = this.transactions.getData().find((item:any)=>(item.referenceid === reference_id))
            } else {
            this.router.navigate(['/login'])
          }

  }

  formatedDate = (savedTime:any) => {
    const date = new Date(savedTime).toLocaleString(
      "gu-IN",
      {
        timeStyle: "medium",
        dateStyle: "short",
      }
    );
    return date
  }

  logout(){
    this.session.clear()
    window.close()
  }

}
