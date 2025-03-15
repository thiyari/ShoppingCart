import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';

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
    private router: Router,
    private route: ActivatedRoute,
    private session: SessionStorageService
  ){}

  ngOnInit(): void {
    const res = this.session.getItem('userData');
        if (res != null || res != undefined) {
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
        this.session.clear()
        window.close()
      }

}
