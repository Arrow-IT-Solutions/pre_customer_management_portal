import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompaniesRoutingModule } from './companies-routing.module';


@NgModule({
  declarations: [
    CompaniesComponent,
    AddCompanyComponent
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class CompaniesModule { }
export interface CompanyResponse extends ResponseBase {
  uuid?: string;
  companyTranslation?: { [key: string]: CompanyTranslationResponse };
  primaryContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface CompanySearchRequest extends SearchRequestBase {
  uuid?: string;
  name?: string;
  primaryContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyRequest extends RequestBase {
  uuid?: string;
  companyTranslation?: CompanyTranslationRequest[];
  primaryContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyTranslationRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface CompanyUpdateRequest extends RequestBase {
  uuid?: string;
  companyTranslation?: CompanyTranslationUpdateRequest[];
  primaryContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyTranslationUpdateRequest {
  uuid?: string;
  name?: string;
  language?: string;
}
