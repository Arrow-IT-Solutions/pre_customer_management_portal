import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardToAddRoutingModule } from './wizard-to-add-routing.module';
import { WizardComponent } from './wizard/wizard.component';
import { DefinitionsComponent } from './customer-service/definitions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EnvironmentComponent } from './environment/environment.component';


@NgModule({
  declarations: [
    WizardComponent,
    DefinitionsComponent,
    EnvironmentComponent,
    
  ],
  imports: [
    CommonModule,
    WizardToAddRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class WizardToAddModule { }
