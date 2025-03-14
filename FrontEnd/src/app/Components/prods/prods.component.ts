import { AfterViewChecked, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-prods',
  standalone: false,
  
  templateUrl: './prods.component.html',
  styleUrl: './prods.component.scss'
})
export class ProdsComponent implements OnInit, AfterViewChecked  {
products: any[] = [];
searchText: string = "";
filteredResult: any[] = []

  constructor(     
    private api: ApiService,
    private router: Router,
    private session: SessionStorageService
  ){}
  
  @ViewChildren('switch') switch!: QueryList<ElementRef>;
  ngAfterViewChecked() {
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
    const res = this.session.getItem('userData');

              if (res.log_status === "admin") {
                this.api.getProducts()
                .subscribe(res=>{
                  if (res.message === "Success"){
                        this.products = res.records
                        // sorting the result according to datetime in descending order
                        this.products.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        this.search()
                    }
                  })

            } else {
            this.router.navigate(['/login'])
          }

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
      this.session.clear()
      window.close()
    }

}
