import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenewsRoutingModule } from './renews-routing.module';
import { RenewsComponent } from './renews/renews.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { CompanyServiceResponse } from '../wizard-to-add/wizard-to-add.module';


@NgModule({
  declarations: [
    RenewsComponent
  ],
  imports: [
    CommonModule,
    RenewsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class RenewsModule { }
export interface RenewRequest extends RequestBase{
  uuid?:string,
  subscriptionIDFK?:string,
  companyServiceIDFK?:string,
  durationValue?:string,
  durationType?:string,
}
export interface RenewResponse extends ResponseBase{
  uuid?:string,
  date?:string,
  subscriptionIDFK?:string,
  companyServiceIDFK?:string,
  durationValue?:string,
  durationType?:string,
  durationTypeValue?:string,
  newEndDate?: string;
  companyService?: CompanyServiceResponse;
 
}
export interface RenewUpdateRequest extends RequestBase{
  uuid?:string,
  subscriptionIDFK?:string,
  companyServiceIDFK?:string,
  durationValue?:string,
  durationType?:string,
}
export interface RenewSearchRequest extends SearchRequestBase{
  uuid?:string,
  subscriptionIDFK?:string,
  companyServiceIDFK?:string,
  durationValue?:string,
  durationType?:string,
   FromDate?: string;   
    ToDate?: string; 
    companyName?:string;
}