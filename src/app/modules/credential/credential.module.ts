import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CredentialRoutingModule } from './credential-routing.module';
import { CredentialComponent } from './credential/credential.component';
import { AddCredentialComponent } from './add-credential/add-credential.component';
import { ResponseBase } from 'src/app/shared/class/class';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


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
  ]
})
export class CredentialModule { }
export interface CredentialResponse extends ResponseBase {
  
}
