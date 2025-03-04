import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-prodreg',
  standalone: false,
  
  templateUrl: './prodreg.component.html',
  styleUrl: './prodreg.component.scss'
})
export class ProdregComponent implements OnInit {
  name: string ="";
  description: string ="";
  price: string = "";
  images: string[] = [];
  files: string[] = [];
  display: boolean = false;
  // Using ViewChild to access the div by its reference variable
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private api: ApiService,
    private http: HttpClient, 
    private router: Router
   ){ }
  ngOnInit(): void {
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "user") {
                this.router.navigate(['/login'])
            }
          } else {
            this.router.navigate(['/login'])
          }
    })
  }

  upload_images(event:any){
    this.files = []
    let base64:string[] = []
    for (let i = 0; i < event.target.files.length; i++) {
       this.files.push(event.target.files[i].name)
       let file = event.target.files[i];
       let reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = function () {
        base64.push(reader.result as string)
       };
       reader.onerror = function (error) {
         console.log('Error: ', error);
       };
    }
    this.images = base64
    this.check_files();
  }

  pop_file(){
    this.images.splice(-1,1)
    this.files.splice(-1,1)
    this.check_files();
  }

  check_files(){
    if (this.files.length != 0) {
      this.display = true
    } else {
      this.display = false
      // Refresh the file input
      if (this.fileInput) {
        // Access the content of the fileInput using nativeElement
        this.fileInput.nativeElement.value = "";
      }
    }
  }

  prod_reg()
  {
    if (this.name === "" || this.description === "" || this.price === "" || this.files.length === 0 || this.images.length === 0){
      alert("Please fill the fields and upload an image")
    }
    else {
      const currDate = new Date().toLocaleDateString();
      const currTime = new Date().toLocaleTimeString();
      const datetime = currDate+currTime
      const random_digits = datetime.replace(/[^0-9]/g, "")
      const pid = Math.floor(10 + Math.random() * 90)+random_digits;
      let bodyData = {
        "pid": pid,
        "name" : this.name,
        "description" : this.description,
        "price" : this.price,
        "images": this.images,
        "display": false
      };

      const payloadSize = Buffer.byteLength(JSON.stringify(bodyData), 'utf8');
      //console.log(`Payload size: ${payloadSize} bytes`);

      if (payloadSize < 52428800){
        const status = this.api.addProduct(bodyData)
          if (status){
            alert("Product Registered Successfully");
            this.name = '';
            this.description = '';
            this.price  = '';
            this.images = []  
            this.files = []
            this.check_files();
          } else {
            alert("Unable to Register the product")
          }
      } else {
        alert("Please upload the files less then 50 MB")
      }
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


