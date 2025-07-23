import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardAddServerRoutingModule } from './wizard-add-server-routing.module';
import { WizardComponent } from './wizard/wizard.component';
import { ServerComponent } from './server/server.component';
import { ApplicationComponent } from './application/application.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WizardComponent,
    ServerComponent,
    ApplicationComponent
  ],
  imports: [
    CommonModule,
    WizardAddServerRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class WizardAddServerModule { }
