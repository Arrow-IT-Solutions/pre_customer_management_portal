import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Core/services/user.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { LocalService } from 'src/app/shared/service/local.service';



@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {

  currentlang = 'English';

  constructor(public layoutService : LayoutService,public localService:LocalService, public router : Router,public userService:UserService,@Inject(DOCUMENT) private document: Document){}

  logout() {
    this.localService.removeData('currentUser');
    this.router.navigate(['auth/login']);

   

  }

  async ngOnInit() {
    this.checkCurrentLang();
  }

  changeLang(lang : string)
  {
     console.log("current Lang : ",lang);

    if(lang == 'en')
    {
      this.currentlang = "English"
      this.layoutService.config = 
      {
        dir : 'ltr',
        lang : 'en'
      }

    }
    else if( lang == 'ar')
    {
      this.currentlang = "عربي"
      this.layoutService.config = 
      {
        dir : 'rtl',
        lang : 'ar'
      }
    }

    localStorage.setItem('lang', this.layoutService.config.lang);
    localStorage.setItem('dir', this.layoutService.config.dir);
    this.document.documentElement.lang = this.layoutService.config.lang;

     window.location.reload();
  }
   checkCurrentLang() {
    if(this.layoutService.config.lang == 'en')
      {
        this.currentlang = "English"
       
  
      }
      else if( this.layoutService.config.lang == 'ar')
      {
        this.currentlang = "عربي"
       
      }
  }
}


