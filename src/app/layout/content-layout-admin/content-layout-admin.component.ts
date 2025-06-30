import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../service/layout.service';
import { AdhostDirective } from 'src/app/Core/directive/adhost.directive';

@Component({
  selector: 'app-content-layout-admin',
  templateUrl: './content-layout-admin.component.html',
  styleUrls: ['./content-layout-admin.component.scss']
})
export class ContentLayoutAdminComponent implements OnInit {

  @ViewChild(AdhostDirective, { static: true }) adHost!: AdhostDirective;

  
  constructor (public layoutService:LayoutService){}

  ngOnInit(): void {
    
    console.log("Orginal instance : ",this.adHost);
    this.layoutService.adHost = this.adHost
    console.log("copy instance : ",this.layoutService.adHost);
    // this.adHost.viewContainerRef.clear();
    // const component = this.adHost.createMyComponent(DynamicDilogComponent);
  }

}
