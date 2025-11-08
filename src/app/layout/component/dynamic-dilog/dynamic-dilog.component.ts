import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, Input, Type, ViewChild } from '@angular/core';
import { AdhostDirective } from 'src/app/Core/directive/adhost.directive';

@Component({
  selector: 'app-dynamic-dilog',
  templateUrl: './dynamic-dilog.component.html',
  styleUrls: ['./dynamic-dilog.component.scss']
})
export class DynamicDilogComponent {

  @ViewChild(AdhostDirective, { static: true }) adHostChild!: AdhostDirective;

  @Input() componentName: string = "componet Name";
  @Input() componentView: any;
  @Input() adHostDynamic: any;
  @Output() OnClose: EventEmitter<void> = new EventEmitter<void>();




  ngOnInit(): void {

    this.adHostChild.viewContainerRef.clear();
    this.adHostChild.createMyComponent(this.componentView);

  }

  Close() {


    this.OnClose.emit();
    this.adHostChild.viewContainerRef.clear();
    this.adHostDynamic.viewContainerRef.clear();
    //this.component.destroy();
    //this.componentView.clear();

  }

}


