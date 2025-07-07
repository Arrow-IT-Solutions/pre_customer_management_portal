import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortRoutingModule } from './port-routing.module';
import { PortsComponent } from './ports/ports.component';
import { AddPortComponent } from './add-port/add-port.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    PortsComponent,
    AddPortComponent
  ],
  imports: [
    CommonModule,
    PortRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PortModule { }
export interface PortResponse extends ResponseBase {
  
}
