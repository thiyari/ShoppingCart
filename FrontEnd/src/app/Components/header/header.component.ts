import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  public title: string = environment.COMPANY_NAME
  public totalItem: number = 0;
  public searchTerm: string = "";
  public session_status: any;
  constructor(
    private cartService: CartService,
    private http: HttpClient, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.cartService.getProducts()
    .subscribe(res=>{
      this.totalItem = res.length;
    })
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
      this.session_status = res
    })
  }
  search(event: any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.cartService.search.next(this.searchTerm)
  }

  session_verify(){
    
      if(this.session_status.valid){
          if (this.session_status.isLoggedIn && this.session_status.log_status === "user") {
            window.open("/user-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
          } 
          else if (this.session_status.isLoggedIn && this.session_status.log_status === "admin") {
            window.open("/admin-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
          }
      } else {
        this.router.navigate(['/login'])
      }
    
  }
}
