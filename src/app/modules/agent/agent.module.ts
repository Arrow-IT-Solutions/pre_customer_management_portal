import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { AgentRoutingModule } from './agent-routing.module';
import { AgentComponent } from './agent/agent.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { CompanyResponse } from '../companies/companies.module';


@NgModule({
  declarations: [
    AgentComponent,
    AddAgentComponent
  ],
  imports: [
    CommonModule,
    AgentRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AgentModule { }

export interface AgentResponse extends ResponseBase {
  uuid?: string;
  phone?: string;
  companyIDFK: string;
  anyDeskAddress?: string;
  password?: string;
  agentTranslation?: { [key: string]: AgentTranslationResponse };
  company?: CompanyResponse;
}

export interface AgentSearchRequest extends SearchRequestBase {
  uuid?: string;
  phone?: string;
  companyIDFK?: string;
  anyDeskAddress?: string;
  name?: string;
}

export interface AgentRequest extends RequestBase {
  phone: string;
  anyDeskAddress: string;
  password?: string;
  companyIDFK: string;
  agentTranslation?: AgentTranslationRequest[];
}

export interface AgentUpdateRequest extends RequestBase {
  uuid?: string
  phone?: string;
  anyDeskAddress?: string;
  password?: string;
  companyIDFK?: string;
  agentTranslation?: AgentTranslationRequest[];
}

export interface AgentTranslationRequest {
  uuid?: string;
  name?: string;
  language?: string;
}

export interface AgentTranslationResponse {
  uuid?: string;
  name?: string;
  language?: string;
}
