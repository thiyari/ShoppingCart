import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-paypal-success',
  standalone: false,
  
  templateUrl: './paypal-success.component.html',
  styleUrl: './paypal-success.component.scss'
})
export class PaypalSuccessComponent implements OnInit{

  public transaction: any;
  public order: any; 
  public response: any;
  pdfTable: any;

  constructor(private api: ApiService, private route: ActivatedRoute){}

  ngOnInit(): void {
    const reference_id = this.route.snapshot.params["referenceid"]; 
    this.api.paypal_txn()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.transaction = res.records.find((item:any)=>{return(item.referenceid===reference_id)})
        }
      });

    this.api.getOrders()
    .subscribe(res=>{
      if (res.message === "Success"){
        this.order = res.records.find((item:any)=>{return(item.referenceid === reference_id)})
        }
      })
      this.response = { ...this.order, ...this.transaction };
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
  
  public downloadAsPDF(){
      let data = document.getElementById('gen_pdf')!;  
      html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  // 'image/jpeg' for lower quality output.
      //let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      let pdf = new jspdf('p', 'cm', 'a4'); // Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 2.5, 2, 16, 10.5);  
      pdf.save(this.response.referenceid+'.pdf');   
    }); 
  }



}
