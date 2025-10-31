import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompaniesRoutingModule } from './companies-routing.module';
import { AgentsListComponent } from './agents-list/agents-list.component';
import { InlineAddAgentComponent } from './inline-add-agent/inline-add-agent.component';
import { UserResponse } from '../auth/auth.module';


@NgModule({
  declarations: [
    CompaniesComponent,
    AddCompanyComponent,
    AgentsListComponent,
    InlineAddAgentComponent,
   
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
  user: UserResponse,
  userIDFK: string,
  password?: string,
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

export interface AgentResponse extends ResponseBase {
  uuid?: string;
  phone?: string;
  companyIDFK: string;
  anyDeskAddress?: string;
  password?: string;
  agentTranslation?: { [key: string]: AgentTranslationResponse };
  company?: CompanyResponse;
}

export interface AgentTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface AgentSearchRequest extends SearchRequestBase {
  uuid?: string;
  phone?: string;
  companyIDFK?: string;
  anyDeskAddress?: string;
  name?: string;
}
