import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServersRoutingModule } from './servers-routing.module';
import { ServersComponent } from './servers/servers.component';
import { AddServerComponent } from './add-server/add-server.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    ServersComponent,
    AddServerComponent
  ],
  imports: [
    CommonModule,
    ServersRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ServersModule { }
export interface ServerRequest extends RequestBase
{
uuid?:string;
ipAddress?:string;
hostname?: string;
}

export interface ServerUpdateRequest extends RequestBase
{
uuid?:string;
ipAddress?:string;
hostname?: string;
}

export interface ServerSearchRequest extends RequestBase
{
uuid?:string;
ipAddress?:string;
hostname?: string;
}

export interface ServerResponse extends ResponseBase
{
uuid?:string;
ipAddress?:string;
hostname?: string;
}
