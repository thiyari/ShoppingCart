import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prods',
  standalone: false,
  
  templateUrl: './prods.component.html',
  styleUrl: './prods.component.scss'
})
export class ProdsComponent implements OnInit, AfterViewInit  {
products: any[] = [];
searchText: string = "";
filteredResult: any[] = []

  constructor(     
    private api: ApiService,
    private http: HttpClient, 
    private router: Router
  ){}
  
  @ViewChildren('switch') switch!: QueryList<ElementRef>;
  ngAfterViewInit() {

    // After the view is initialized, loop through the switches and add event listeners
    this.switch.toArray().forEach(switchElement => {
      switchElement.nativeElement.addEventListener('change', (event:any) => this.handleSwitchChange(event));
    });

  }

  handleSwitchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    //console.log(`${target.id} is now ${target.checked ? 'ON' : 'OFF'}`);
    if (target.checked){
      let body = {
        "display": true
      }
      this.api.update_show(target.id, body)
    } else {
      let body = {
        "display": false
      }
      this.api.update_show(target.id, body)
    }
  }

  ngOnInit(): void {
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "admin") {
                this.api.getProducts()
                .subscribe(res=>{
                  if (res.message === "Success"){
                        this.products = res.records
                    }
                  })
                // sorting the result according to datetime in descending order
                this.products.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                this.search()
            }
          } else {
            this.router.navigate(['/login'])
          }
    })
  }

  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  search() {
    this.filteredResult = this.searchText === "" ? this.products : this.products.filter((x:any) => {
      return (
        JSON.stringify(x.pid).includes(this.searchText)
      )
    });
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

  delete_product(id: any, pid: any){
    const status = this.api.delete_product(id, pid);
    if(status){
      this.filteredResult = this.filteredResult.filter((item:any) => item._id != id);
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
