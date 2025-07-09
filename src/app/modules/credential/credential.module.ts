import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CredentialRoutingModule } from './credential-routing.module';
import { CredentialComponent } from './credential/credential.component';
import { AddCredentialComponent } from './add-credential/add-credential.component';
import { RequestBase, ResponseBase } from 'src/app/shared/class/class';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    CredentialComponent,
    AddCredentialComponent
  ],
  imports: [
    CommonModule,
    CredentialRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
    providers: [
      ConfirmationService, 
      MessageService
    ]
})
export class CredentialModule { }
export interface CredentialRequest extends RequestBase
{
uuid?:string;
portNumber?:string;
serverIDFK?: string;
}

export interface CredentialUpdateRequest extends RequestBase
{
uuid?:string;
userName?:string;
password?:string;
portIDFK?: string;
}

export interface CredentialSearchRequest extends RequestBase
{
uuid?:string;
userName?:string;
portIDFK?: string;
}

export interface CredentialResponse extends ResponseBase
{
uuid?:string;
 requestStatus?:string;
 requestMessage?:string;
userName?:string;
password?:string;
portIDFK?: string;
 portResponse?: {
    uuid?: string;
    portNumber?: string;
  };
}

