import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase, RequestBase, SearchRequestBase } from 'src/app/shared/class/class';
import { AddApplicationComponent } from './add-application/add-application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application/application.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    AddApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ApplicationModule { }
export interface ApplicationResponse extends ResponseBase {
  uuid?: string;
  applictionTranslations?: { [key: string]: ApplicationTranslationResponse };
  url?: string;
  icon?: string;

}

export interface ApplicationTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface ApplicationSearchRequest extends SearchRequestBase {
  uuid?: string;
  name?: string;
}

export interface ApplicationRequest extends RequestBase {
  uuid?: string;
  applictionTranslations?: ApplicationTranslationRequest[];
  url?: string;
  icon?: string;
}

export interface ApplicationTranslationRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface ApplicationUpdateRequest extends RequestBase {
  uuid?: string;
  applictionTranslations?: ApplicationTranslationUpdateRequest[];
  url?: string;
  icon?: string;
}

export interface ApplicationTranslationUpdateRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

