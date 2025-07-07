import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    CustomersComponent,
    AddCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CustomersModule { }
export interface CustomerResponse extends ResponseBase {
  uuid?: string;
  customerTranslation?: { [key: string]: CustomerTranslationResponse };
  primaryContact?: string;
  phone?: string;
  email?: string;
  anydeskAddress?: string;
}

export interface CustomerTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface CustomerSearchRequest extends SearchRequestBase {
  uuid?: string;
  name?: string;
  primaryContact?: string;
  phone?: string;
  email?: string;
  anydeskAddress?: string;
}

export interface CustomerRequest extends RequestBase {
  uuid?: string;
  customerTranslation?: CustomerTranslationRequest[];
  primaryContact?: string;
  phone?: string;
  email?: string;
  anydeskAddress?: string;
}

export interface CustomerTranslationRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface CustomerUpdateRequest extends RequestBase {
  uuid?: string;
  customerTranslation?: CustomerTranslationUpdateRequest[];
  primaryContact?: string;
  phone?: string;
  email?: string;
  anydeskAddress?: string;
}

export interface CustomerTranslationUpdateRequest {
  uuid?: string;
  name?: string;
  language?: string;
}
