import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-admins-panel',
  standalone: false,
  
  templateUrl: './admins-panel.component.html',
  styleUrl: './admins-panel.component.scss'
})
export class AdminsPanelComponent implements OnInit{
admins: any;
  constructor(     
    private api: ApiService,
    private router: Router,
    private session: SessionStorageService
  ){}

  ngOnInit(): void {
    const res = this.session.getItem('userData');

              if (res.log_status === "admin") {
                this.api.getAdmins()
                .subscribe(res=>{
                  if (res.message === "Success"){
                        this.admins = res.records
                    }
                  })
            } else {
            this.router.navigate(['/login'])
          }
    
  }

  delete_admin(id: any, name: any){
    const status = this.api.delete_admin(id, name);
    if(status){
      this.admins = this.admins.filter((item:any) => item._id != id);
    }
  }

  logout(){
    this.session.clear();
    window.close();
  }
}
