import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardToAddRoutingModule } from './wizard-to-add-routing.module';
import { WizardComponent } from './wizard/wizard.component';
import { DefinitionsComponent } from './customer-service/definitions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EnvironmentComponent } from './environment/environment.component';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { CustomerResponse } from '../customers/customers.module';
import { ServiceResponse } from '../services/services.module';
import { EnvironmentResponse, EnvironmentTranslationRequest, EnvironmentTranslationUpdateRequest } from '../environment/environment.module';
import { SubscriptionRequest, SubscriptionResponse, SubscriptionUpdateRequest } from '../subscription/subscription.module';
import { DatabaseResponse } from '../data-bases/data-bases.module';


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

export interface ProvisionedSession {
  customerIDFK?: string;
  serviceIDFK?: string;
  subscription?: SubscriptionRequest;
  envDatabases?: EnvDatabase[];
  subscriptionUpdate?: SubscriptionUpdateRequest;
  envDatabasesUpdate?: UpdateEnvDatabase[];
}
export interface ProvisionedServiceRequest extends RequestBase {
  customerIDFK?: string;
  serviceIDFK?: string;
  subscription?: SubscriptionRequest;
  envDatabases?: EnvDatabase[];
}

export interface EnvDatabase {
  url: string;
  serverIDFK: string;
  environmentTranslation: EnvironmentTranslationRequest[];
  dbName: string;
  connectionString: string;
  dbUserName: string;
  dbPassword: string;
}

export interface ProvisionedServiceSearchRequest extends SearchRequestBase {
  uuid?: string;
  CustomerIDFK?: string;
  ServiceIDFK?: string;
  IncludeCustomer?: string;
  IncludeService?: string;
}

export interface ProvisionedServiceResponse extends ResponseBase {
  uuid: string;
  customer: CustomerResponse;
  service: ServiceResponse;
  subscription: SubscriptionResponse;
  environments: EnvironmentResponse[];
  databases: DatabaseResponse[];

}

export interface ProvisionedServiceUpdateRequest extends RequestBase {
  uuid: string;
  customerIDFK?: string;
  serviceIDFK?: string;
  subscription?: SubscriptionUpdateRequest;
  envDatabases?: UpdateEnvDatabase[];
}

export interface UpdateEnvDatabase {
  url: string;
  serverIDFK: string;
  environmentTranslation: EnvironmentTranslationUpdateRequest[];
  dbName: string;
  connectionString: string;
  dbUserName: string;
  dbPassword: string;
}


export interface CustomerServiceResponse extends ResponseBase {
  uuid: string;
  customerIDFK: string;
  serviceIDFK: string;
  customer: CustomerResponse;
  service: ServiceResponse;
}
