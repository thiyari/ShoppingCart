import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-products',
  standalone: false,
  
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public productsList: any;
  searchKey: string = "";
  constructor(private api: ApiService, private cartService: CartService){}

  ngOnInit(): void {
    this.api.getProducts()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.productsList = res.records.filter((item:any)=>item.display);
      }
    })

    this.cartService.search.subscribe((value:any)=>{
      this.searchKey = value;
    })
  }

}
