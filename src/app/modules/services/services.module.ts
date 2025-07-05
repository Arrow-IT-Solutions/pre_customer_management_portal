import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services/services.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    ServicesComponent,
    AddServiceComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ServicesModule { }
export interface ServiceResponse extends ResponseBase {
  
}
