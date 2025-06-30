import { Component } from '@angular/core';
import { NavbarData, navbarData } from './main-menu-admin.util';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-main-menu-admin',
  templateUrl: './main-menu-admin.component.html',
  styleUrls: ['./main-menu-admin.component.scss']
})
export class MainMenuAdminComponent {
  navData = navbarData;
  multiple: boolean = false;
  subMenuSelected: NavbarData;
  openSubMenuId: string | null = null;
  
  constructor(public router: Router,public layoutService : LayoutService) {}

  ngOnInit() {
    this.subMenuSelected = this.navData[1];
    console.log("Current config : ",this.layoutService.config)
  }

  handleClick(item: NavbarData): void {
    console.log('Items : ', item);
    this.shrinkItems(item);

    item.expanded = !item.expanded;
  }

  CheckAccordion(data : any)
  {
    var condation = data.items == null ? 'none' : 'collapse'
    var row = condation + data.id;
    return row
  }

  CheckAccordionID(data : any)
  {
    var condation = data.items == null ? 'none' : 'collapse'
    var row = "#" + condation + data.id;
    return row
  }

  getActiveClass(data: NavbarData): string {
    return this.router.url.includes(data.routeLink!) ? 'active' : 'inactive';
  }

  shrinkItems(item: NavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }

  getClassNoItemClass(data: NavbarData): string {
    return data.items == null ? 'main-menu__item' : '';
  }

  ExpandItem(data: NavbarData) {
    console.log("Data : ",data);
    this.subMenuSelected = data;
    console.log(' subMenuSelected NavbarData : ', data);
  }

  logRouterLink(routeLink: string) {
    console.log('Router link clicked:', routeLink);
  }



  toggleSubMenu(id: string): void {

    if (this.openSubMenuId === id) {
      this.openSubMenuId = null;
    } else {
      this.openSubMenuId = id;
    }
  }

  isSubMenuOpen(id: string): boolean {
    return this.openSubMenuId === id;
  }
}
