import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services/services.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';


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
export interface ServiceRequest extends RequestBase {
  uuid?: string;
  description: string;
  serviceTranslation: ServiceTranslationRequest[];
}

export interface ServiceUpdateRequest extends RequestBase {
  uuid: string;
  description?: string;
  serviceTranslation?: ServiceTranslationUpdateRequest[];
}

export interface ServiceSearchRequest extends SearchRequestBase {
  uuid?: string;
  name?: string;
}

export interface ServiceResponse extends ResponseBase {
  uuid: string;
  description: string;
  serviceTranslation: { [key: string]: ServiceTranslationResponse };
}

export interface ServiceTranslationRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface ServiceTranslationUpdateRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface ServiceTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}
