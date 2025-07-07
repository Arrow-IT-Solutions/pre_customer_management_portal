import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {
  items: MenuItem[];
  activeIndex = 0;
  constructor(public layoutService: LayoutService) {}
  ngOnInit() {
    this.items = [
      {
        label: this.isAr() ? 'التعريف' : 'Definitions',
        routerLink: 'definitions',
      },
      {
        label: this.isAr() ? 'المتغيرات': 'Variants',
        routerLink: 'variants',
      },
    ];
  }

  isAr(): boolean {
    if (this.layoutService.config.lang == 'ar') {
      return true;
    } else {
      return false;
    }
  }

}
