import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Core/services/user.service';
import { SubjectsService } from 'src/app/shared/service/subjects.service';
import { LayoutService } from '../service/layout.service';
import { LocalService } from 'src/app/shared/service/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuStatus!: boolean;
  constructor(
    private subjectsService: SubjectsService,
    public userService: UserService,
    public layoutService: LayoutService,
    public localService: LocalService,
    public router: Router
  ) {}

  ngOnInit() {}

  handleClick(): void {
    this.subjectsService.menuStatus$.subscribe({
      next: (e: any) => (this.menuStatus = e),
    });
    this.subjectsService.menuStatus$.next(!this.menuStatus);
  }

  changeLang() {
    console.log('lang before: ', this.layoutService.config.lang);
    if (this.layoutService.config.lang == 'en') {
      //lang
      this.layoutService.config.lang = 'ar';
      this.localService.saveData('lang', JSON.stringify('ar'));
      //dir
      this.layoutService.config.dir = 'rtl';
      this.localService.saveData('dir', JSON.stringify('rtl'));
    } else {
      //lang
      this.layoutService.config.lang = 'en';
      this.localService.saveData('lang', JSON.stringify('en'));
      //dir
      this.layoutService.config.dir = 'ltr';
      this.localService.saveData('dir', JSON.stringify('ltr'));
    }
    console.log('lang after: ', this.layoutService.config.lang);
    window.location.reload();
  }

  logout() {
    this.localService.removeData('currentUser');
    this.router.navigate(['auth/login']);
  }
}
