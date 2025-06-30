import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordComponent } from './password/password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordRoutingModule } from './password-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    PasswordComponent,
    ResetPasswordComponent,

  ],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    SharedModule,
    ReactiveFormsModule,


  ]
})
export class PasswordModule { }

export interface EmployeeResetPass {
  uuid?: string;
  password?: string;
}
