import { Component, OnInit } from '@angular/core';

import { NavbarData, navbarData } from './main-menu.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  navData = navbarData;
  multiple: boolean = false;
  subMenuSelected: NavbarData;

  constructor(public router: Router) { }

  ngOnInit() {
    this.subMenuSelected = this.navData[1];
  }

  handleClick(item: NavbarData): void {
    console.log('Items : ', item);
    this.shrinkItems(item);

    item.expanded = !item.expanded;
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
    this.subMenuSelected = data;
    console.log(' subMenuSelected NavbarData : ', data);
  }

  logRouterLink(routeLink: string) {
    console.log('Router link clicked:', routeLink);
  }
}
