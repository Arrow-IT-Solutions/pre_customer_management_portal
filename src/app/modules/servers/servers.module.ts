import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServersRoutingModule } from './servers-routing.module';
import { ServersComponent } from './servers/servers.component';
import { AddServerComponent } from './add-server/add-server.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { ApplicationRequest } from '../applications/application.module';
import { ServerDetailesComponent } from './server-detailes/server-detailes.component';


@NgModule({
  declarations: [
    ServersComponent,
    AddServerComponent,
    ServerDetailesComponent
  ],
  imports: [
    CommonModule,
    ServersRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ServersModule { }

export interface ServerRequest {
  uuid?: string;
  hostname?: string;
  ipAddress?: string;
}

export interface ServerUpdateRequest {
  uuid?: string;
  hostname?: string;
  ipAddress?: string;
}

export interface ServerSearchRequest extends RequestBase {
  uuid?: string;
  hostname?: string;
  ipAddress?: string;

}

export interface ServerResponse extends ResponseBase {
  uuid?: string;
  hostname?: string;
  ipAddress?: string;
  url: string,
  username: string,
  password: string,
}
export interface ServerRequest extends RequestBase {
  uuid?: string;
  ipAddress?: string;
  hostname?: string;
}

export interface ServerUpdateRequest extends RequestBase {
  uuid?: string;
  ipAddress?: string;
  hostname?: string;
}

export interface ServerSearchRequest extends RequestBase {
  uuid?: string;
  ipAddress?: string;
  hostname?: string;
}

export interface ServerResponse extends ResponseBase {
  uuid?: string;
  ipAddress?: string;
  hostname?: string;
}

export interface ProvisionedServerRequest {
  uuid?: string;
  hostname?: string;
  ipAddress?: string;
  url?: string;
  username?: string;
  password?: string;
  applications: ApplicationRequest[];
  deletedApps?: string[];
}
