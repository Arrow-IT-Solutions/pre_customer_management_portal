import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironmentRoutingModule } from './environment-routing.module';
import { EnvironmentComponent } from './environment/environment.component';
import { AddEnvironmentComponent } from './add-environment/add-environment.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';

@NgModule({
  declarations: [
    EnvironmentComponent,
    AddEnvironmentComponent
  ],
  imports: [
    CommonModule,
    EnvironmentRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EnvironmentModule { }


export interface EnvironmentRequest extends RequestBase {
  uuid?: string;
  customerServiceIDFK: string;
  url: string;
  serverIDFK: string;
  environmentTranslation: EnvironmentTranslationRequest[];
}

export interface EnvironmentUpdateRequest extends RequestBase {
  uuid: string;
  customerServiceIDFK?: string;
  url?: string;
  serverIDFK?: string;
  environmentTranslation?: EnvironmentTranslationUpdateRequest[];
}

export interface EnvironmentSearchRequest extends SearchRequestBase {
  uuid?: string;
  customerServiceIDFK?: string;
  serverIDFK?: string;
  name?: string;
}

export interface EnvironmentResponse extends ResponseBase {
  uuid: string;
  customerServiceIDFK: string;
  url: string;
  serverIDFK: string;
  environmentTranslation: EnvironmentTranslationResponse[];
}

export interface EnvironmentTranslationRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface EnvironmentTranslationUpdateRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface EnvironmentTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}
