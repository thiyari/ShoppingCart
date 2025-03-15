import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-pending-orders',
  standalone: false,
  
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.scss'
})
export class PendingOrdersComponent implements OnInit{
  orders_records: any;
  filteredResult: any[] = []
  searchText: string = "";
  constructor(
    private api: ApiService,
    private router: Router,
    private session: SessionStorageService
  ){}

  ngOnInit(): void {

    const res = this.session.getItem('userData');
          if (res != null || res != undefined){
              if (res.log_status === "admin") {
                this.api.getOrders()
                .subscribe(res=>{
                  if (res.message === "Success"){
                      var result = res.records.filter((item:any)=>item.transactionstatus === "pending")
                      this.orders_records = result.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      this.search();
                    }
                  })                
            } 
          } else {
            this.router.navigate(['/login'])
          }

  }

  onDelete(orderid:any){
    const status = this.api.delete_order(orderid)
    if(status){
      this.filteredResult = this.filteredResult.filter((item:any) => item.orderid != orderid);
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


  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  search() {
    this.filteredResult = this.searchText === "" ? this.orders_records : this.orders_records.filter((x:any) => {
      return (
        x.referenceid.toLowerCase().includes(this.searchText.toLowerCase()) ||
        JSON.stringify(x.orderid).includes(this.searchText)
      )
    });

  }

  logout(){
    this.session.clear();
    window.close();
  }


}
