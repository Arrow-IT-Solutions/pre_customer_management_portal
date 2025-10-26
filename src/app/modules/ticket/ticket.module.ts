import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing-module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketComponent } from './ticket/ticket.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { AgentResponse } from '../agent/agent.module';


@NgModule({
  declarations: [
    TicketComponent,
    AddTicketComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TicketModule { }

export interface TicketResponse extends ResponseBase {
  uuid?: string;
  agentIDFK?: string;
  status?: string;
  statusValue?: string;
  creationDate?: string;
  closureDate?: string;
  description?: string;
  agent?: AgentResponse;
}

export interface TicketSearchRequest extends SearchRequestBase {
  uuid?: string;
  agentIDFK?: string;
  status?: string;
  toDate?: string;
  fromDate?: string;
  companyName?: string;
  agentName?: string;
}

export interface TicketRequest extends RequestBase {
  agentIDFK: string;
  description: string;
  status: string;
}

export interface TicketUpdateRequest extends RequestBase {
  uuid?: string;
  description?: string;
  status?: string;
  closureDate?: string;
  agentIDFK?: string;
}

