import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationsComponent } from './applications/applications.component';
import { AddApplicationComponent } from './add-application/add-application.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase } from 'src/app/shared/class/class';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServerResponse } from '../servers/servers.module';


@NgModule({
  declarations: [
    ApplicationsComponent,
    AddApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService, MessageService]

})
export class ApplicationModule { }
export interface ApplicationRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
url?: string;
userName?: string;
password?: string;
name?: string;

}

export interface ApplicationUpdateRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
url?: string;
userName?: string;
password?: string;
name?: string;

}

export interface ApplicationSearchRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
name?:string;
includeServer?:string;
url?: string;

}

export interface ApplicationResponse extends ResponseBase
{
uuid?:string;
 requestStatus?:string;
 requestMessage?:string;
 name?:string;
  password?:string;
  url?: string;
 userName?:string;
portNumber?:string;
serverIDFK?: string;
 serverResponse?: ServerResponse;
}
