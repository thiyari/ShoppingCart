import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-prod-edit',
  standalone: false,
  
  templateUrl: './prod-edit.component.html',
  styleUrl: './prod-edit.component.scss'
})
export class ProdEditComponent implements OnInit{

  upload_fileNames: string[] = [];
  upload_images: string[] = [];
  uploadToggle: boolean = false;
  name: string = "";
  description: string = "";
  price: string = "";
  id: string = "";
  pid: string = "";
  images: string[] = [];
  currentPhotoIndex: number = 0;

  constructor(
    private api: ApiService,
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute,
   ){ }  
  
  ngOnInit(): void {
    this.http.get<any>(`${environment.SERVER_URI}/api/session`)
    .subscribe((res)=>{
          if(res.valid){
              if (res.log_status === "admin") {

                this.pid = this.route.snapshot.params['pid'];
                this.api.getProducts().subscribe((res:any)=>{
                  if(res.message === "Success"){
                    const record = res.records.find((item:any)=>(JSON.stringify(item.pid) === this.pid))
                    this.id = record._id;
                    this.name = record.name;
                    this.description = record.description;
                    this.price = record.price;
                    this.images = record.images;
                  }
                })
            }
          } else {
            this.router.navigate(['/login'])
          }
    })    
  }

  edit_product(){
    if (this.name === "" || this.description === "" || this.price === ""){
      alert("Please fill the fields")
    }
    else{
      let bodyData = {
        "name" : this.name,
        "description" : this.description,
        "price": parseInt(this.price),
      }
      this.api.edit_product(bodyData, this.id)
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

                          
  handlePrevClick(e:any){
    e.preventDefault()
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex = this.currentPhotoIndex - 1;
    }
  };
  
  handleNextClick(e:any){
    e.preventDefault()
    if (this.currentPhotoIndex < this.images.length - 1) {
      this.currentPhotoIndex = this.currentPhotoIndex + 1;
    }
  };

  handleDelete(index:any){
    let body = {
      "image": this.images[index]
    }
    this.api.delete_image(this.id, body);
  }

  handleUploadImage(event:any){
    event.preventDefault()
      this.upload_fileNames = [];
      let base64:string[] = []
      for (let i = 0; i < event.target.files.length; i++) {
         this.upload_fileNames.push(event.target.files[i].name)
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
      this.upload_images = base64
      this.uploadToggle = true;
      alert("Click below check mark button to be displayed for submitting uploads")
  };

  handleSubmit(){
    let body = {
      "images": this.upload_images
    }
    this.api.upload_images(this.id, body);
  }

}
