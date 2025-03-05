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
  }
  search(event: any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.cartService.search.next(this.searchTerm)
  }

  session_verify(){
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
      if(res.valid){
          if (res.isLoggedIn && res.log_status === "user") {
            window.open("/user-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
          } 
          else if (res.isLoggedIn && res.log_status === "admin") {
            window.open("/admin-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
          }
      } else {
        this.router.navigate(['/login'])
      }
    })
  }
}
