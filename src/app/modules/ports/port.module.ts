import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortRoutingModule } from './port-routing.module';
import { PortsComponent } from './ports/ports.component';
import { AddPortComponent } from './add-port/add-port.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase } from 'src/app/shared/class/class';
import { ConfirmationService, MessageService } from 'primeng/api';


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
  ],
  providers: [ConfirmationService, MessageService]

})
export class PortModule { }
export interface PortRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
}

export interface PortUpdateRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
}

export interface PortSearchRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
}

export interface PortResponse extends ResponseBase
{
uuid?:string;
 requestStatus?:string;
 requestMessage?:string;
portNumber?:string;
serverIDFK?: string;
 serverResponse?: {
    uuid?: string;
    name?: string;
  };
}
