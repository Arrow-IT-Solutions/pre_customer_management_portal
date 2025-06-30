import { Component, ViewChild } from '@angular/core';
import { AdhostDirective } from './Core/directive/adhost.directive';
import { DynamicDilogComponent } from './layout/component/dynamic-dilog/dynamic-dilog.component';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './Core/services/user.service';

import { LayoutService } from './layout/service/layout.service';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Point Of Sale';

  constructor(
    public translate: TranslateService,
    public userService: UserService,
    public layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    console.log('app ts ngoninit');

  }

 

  getDirection(): Direction | 'auto' {
    return this.layoutService.config.lang === 'ar' ? 'rtl' : 'ltr';
  }
}
