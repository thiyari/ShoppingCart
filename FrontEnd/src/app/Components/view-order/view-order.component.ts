import { Component, OnInit } from '@angular/core';
import { AggregationService } from '../../service/aggregation.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { ToWords } from 'to-words';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-view-order',
  standalone: false,
  
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss'
})
export class ViewOrderComponent implements OnInit{
  public data:any;
  public pidMap = new Map<string, number>();
  public mail_id:any;
  public log_status:any;

  constructor(
    private transactions: AggregationService,
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionStorageService
  ){}
  ngOnInit(): void {


    const res = this.session.getItem('userData');
    if (res != null || res != undefined){

              if (res.log_status === "user") {
                  this.log_status = "user"
              }
              else if (res.log_status === "admin") {
                  this.log_status = "admin"
              } 
            } else {
            this.router.navigate(['/login'])
          }
    

    const order_id = this.route.snapshot.params["orderid"]; 
    var result =this.transactions.getData();
    this.data = result.find((x:any)=>{
      return(x.orderid == parseInt(order_id))
    })
    
    this.data?.ordersplaced.forEach((x:any)=>{
        this.pidMap.set(x.name,x.pid);
    })

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
  downloadAsPDF(){
    let data = document.getElementById('gen_pdf')!;  
    html2canvas(data).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
    //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
    let pdf = new jspdf('p', 'cm', 'a4'); // Generates PDF in portrait mode
    pdf.addImage(contentDataURL, 'PNG', 1, 2, 19, 25);  
    pdf.save(this.data.referenceid+'.pdf');   
  }); 
  }

  amount_in_words_rupees(amount:any){
    const toWords = new ToWords({
      localeCode: 'en-IN',
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: 'Rupee',
          plural: 'Rupees',
          symbol: '₹',
          fractionalUnit: {
            name: 'Paisa',
            plural: 'Paise',
            symbol: '',
          },
        },
      },
    });
    if (amount === null || amount === undefined){
      const result = toWords.convert(0, { currency: true })
      return result
    } else {
      const result = toWords.convert(amount, { currency: true })
      return result;
    }
  }


  amount_in_words_dollars(amount:any){
    const toWords = new ToWords({
      localeCode: 'en-US',
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: 'Dollar',
          plural: 'Dollars',
          symbol: '$',
          fractionalUnit: {
            name: 'Cent',
            plural: 'Cents',
            symbol: '',
          },
        },
      },
    });
    if (amount === null || amount === undefined){
      const result = toWords.convert(0, { currency: true })
      return result
    } else {
    const result = toWords.convert(amount, { currency: true })
    return result;
    }
  }
  
  logout(){
    this.session.clear();
    window.close();
  }

}
