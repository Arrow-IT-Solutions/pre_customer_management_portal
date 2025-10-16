import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { AddSubscripeComponent } from './add-subscripe/add-subscripe.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RenewComponent } from './renew/renew.component';



@NgModule({
  declarations: [
    SubscriptionsComponent,
    AddSubscripeComponent,
    RenewComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class SubscriptionModule { }
export interface SubscriptionRequest extends RequestBase {
  uuid?: string;
  companyServiceIDFK: string;
  startDate: string;
  endDate: string;
  price: string;
  status: string;
}
export interface SubscriptionUpdateRequest extends RequestBase {
  uuid?: string;
  companyServiceIDFK?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  status?: string;
}
export interface SubscriptionSearchRequest extends SearchRequestBase {
  uuid?: string;
  companyServiceIDFK?: string;
  status: string;

}
export interface SubscriptionResponse extends ResponseBase {
  uuid: string;
  companyServiceIDFK: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: string;
  statusValue: string;
  companyService?: string;
}



