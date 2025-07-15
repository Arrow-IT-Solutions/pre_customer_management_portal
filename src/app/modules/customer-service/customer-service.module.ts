import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import { CustomerServicesComponent } from './customer-services/customer-services.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    CustomerServicesComponent
  ],
  imports: [
    CommonModule,
    CustomerServiceRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CustomerServiceModule { }
export interface customerServiceResponse extends ResponseBase {
  
}
