import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SessionStorageService } from '../../service/session-storage.service';

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
  public status: string = "";
  constructor(
    private cartService: CartService,
    private http: HttpClient, 
    private router: Router,
    private session: SessionStorageService
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
  verify_session(event: Event){
    event.preventDefault();
    this.status = this.session.getItem("userData");
    
    if (this.status === undefined || this.status === null || this.status === ""){
      this.router.navigate(['/login']);
      } else if (this.session.getItem("userData")["log_status"] === "admin"){
          window.open("/admin-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
        } else if (this.session.getItem("userData")["log_status"] === "user"){
          window.open("/user-orders", '_blank', 'location=yes,height=auto,width=auto,scrollbars=yes');
        } 
  }
}
