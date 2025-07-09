import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { AddSubscripeComponent } from './add-subscripe/add-subscripe.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    SubscriptionsComponent,
    AddSubscripeComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SubscriptionModule { }
export interface SubscripeResponse extends ResponseBase {
  
}
