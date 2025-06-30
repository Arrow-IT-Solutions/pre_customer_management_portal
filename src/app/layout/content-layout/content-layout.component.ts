import { Component, OnInit, ViewChild } from '@angular/core';
import { AdhostDirective } from 'src/app/Core/directive/adhost.directive';
import { DynamicDilogComponent } from '../component/dynamic-dilog/dynamic-dilog.component';
import { LayoutService } from '../service/layout.service';
import { SubjectsService } from 'src/app/shared/service/subjects.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  @ViewChild(AdhostDirective, { static: true }) adHost!: AdhostDirective;

  menuStatus!: boolean;

  constructor(private subjectsService: SubjectsService,private layoutService:LayoutService) {
    this.subjectsService.menuStatus$.subscribe({
      next: (e) => (this.menuStatus = e),
    });
  }

  ngOnInit(): void {
    this.subjectsService.menuStatus$.next(false);

    console.log("Orginal instance : ",this.adHost);
    this.layoutService.adHost = this.adHost
    console.log("copy instance : ",this.layoutService.adHost);
    // this.adHost.viewContainerRef.clear();
    // const component = this.adHost.createMyComponent(DynamicDilogComponent);
  }

}
