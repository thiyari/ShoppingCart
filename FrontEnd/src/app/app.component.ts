import { Component } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  id: any;
  ref_id: any;
  title = 'FrontEnd';
  showHeader=false;
  showFooter=false;
  constructor(private router:Router){
    router.events.subscribe(
      (val:any)=>{
          if(val instanceof ActivationEnd){
            if(val.snapshot.params['id']) { this.id = val.snapshot.params['id'] }
            if(val.snapshot.params['referenceid']) { this.ref_id = val.snapshot.params['referenceid'] }            
          }
          if(val instanceof NavigationEnd){
            if(val.url === '/' ||
              val.url === '/login' ||
              val.url === '/admin' ||
              val.url === '/products' ||
              val.url === `/product/${this.id}` || 
              val.url === '/cart' || 
              val.url === '/orders' ||
              val.url === `/phonepetxn/${this.ref_id}` ||
              val.url === `/googlepaytxn/${this.ref_id}` ||
              val.url === `/paypaltxn/${this.ref_id}` ||
              val.url === `/razorpaytxn/${this.ref_id}`){
              this.showHeader=true
              this.showFooter=true
            } 
            else {
              this.showHeader=false
              this.showFooter=false
            }
          }
      }
    )
  }
}
