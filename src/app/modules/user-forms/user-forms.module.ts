import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserFormsRoutingModule } from './user-forms-routing.module';
import { FormsComponent } from './forms/forms.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FormsComponent
  ],
  imports: [
    CommonModule,
    UserFormsRoutingModule,
    SharedModule,   
    ReactiveFormsModule
  ]
})
export class UserFormsModule { }
