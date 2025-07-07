import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardToAddRoutingModule } from './wizard-to-add-routing.module';
import { WizardComponent } from './wizard/wizard.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { VariantsComponent } from './variants/variants.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WizardComponent,
    DefinitionsComponent,
    VariantsComponent
  ],
  imports: [
    CommonModule,
    WizardToAddRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class WizardToAddModule { }
