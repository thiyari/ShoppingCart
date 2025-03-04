import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: false,
  
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  product: any;

  constructor(     
    private api: ApiService,
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "admin") {
                const pid = this.route.snapshot.params['pid'];
                this.api.getProducts()
                .subscribe(res=>{
                  if (res.message === "Success"){
                        this.product = res.records.find((item:any)=>JSON.stringify(item.pid)===pid)
                    }
                  })
            }
          } else {
            this.router.navigate(['/login'])
          }
    })

  }


  currentSlide = 0; // Index of the current slide

  // Go to the next slide
  nextSlide() {
    if (this.currentSlide < this.product.images.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // Loop back to the first slide
    }
  }

  // Go to the previous slide
  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.product.images.length - 1; // Loop to the last slide
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
