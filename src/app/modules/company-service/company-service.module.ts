import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase } from 'src/app/shared/class/class';
import { CompanyServiceRoutingModule } from './company-service-routing.module';
import { CompanyServicesComponent } from './company-services/company-services.component';
import { ServicesDetailsComponent } from './services-details/services-details.component';
import { AlertModelComponent } from './alert-model/alert-model.component';


@NgModule({
  declarations: [
    CompanyServicesComponent,
    ServicesDetailsComponent,
    AlertModelComponent
  ],
  imports: [
    CommonModule,
    CompanyServiceRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CompanyServiceModule { }
export interface companyServiceResponse extends ResponseBase {

}
