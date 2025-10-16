import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenewsRoutingModule } from './renews-routing.module';
import { RenewsComponent } from './renews/renews.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RenewsComponent
  ],
  imports: [
    CommonModule,
    RenewsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class RenewsModule { }
