import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardToAddRoutingModule } from './wizard-to-add-routing.module';
import { WizardComponent } from './wizard/wizard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EnvironmentComponent } from './environment/environment.component';
import { RequestBase, ResponseBase, SearchRequestBase } from 'src/app/shared/class/class';
import { ServiceResponse } from '../services/services.module';
import { EnvironmentResponse, EnvironmentTranslationRequest, EnvironmentTranslationUpdateRequest } from '../environment/environment.module';
import { SubscriptionRequest, SubscriptionResponse, SubscriptionUpdateRequest } from '../subscription/subscription.module';
import { DatabaseResponse } from '../data-bases/data-bases.module';
import { ServerResponse } from '../servers/servers.module';
import { CompanyResponse } from '../companies/companies.module';
import { DefinitionsComponent } from './company-service/definitions.component';


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
  companyIDFK?: string;
  serviceIDFK?: string;
  subscription?: SubscriptionRequest;
  envDatabases?: EnvDatabase[];
  subscriptionUpdate?: SubscriptionUpdateRequest;
  envDatabasesUpdate?: UpdateEnvDatabase[];
  currentEnvironmentFormData?: {
    nameEnvEn?: string;
    nameEnvAr?: string;
    urlEnv?: string;
    server?: string;
    databaseName?: string;
    userName?: string;
    password?: string;
  };
  currentCompanyServiceFormData?: {
    companyName?: string;
    service?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    price?: string;
  };
}
export interface ProvisionedServiceRequest extends RequestBase {
  companyIDFK?: string;
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
  server?: ServerResponse
}

export interface ProvisionedServiceSearchRequest extends SearchRequestBase {
  uuid?: string;
  companyIDFK?: string;
  serviceIDFK?: string;
  companyName?: string;
  includeCompany?: string;
  includeService?: string;
}

export interface ProvisionedServiceResponse extends ResponseBase {
  uuid: string;
  company: CompanyResponse;
  service: ServiceResponse;
  subscription: SubscriptionResponse;
  environments: EnvironmentResponse[];
  databases: DatabaseResponse[];

}

export interface ProvisionedServiceUpdateRequest extends RequestBase {
  uuid: string;
  companyIDFK?: string;
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


export interface CompanyServiceResponse extends ResponseBase {
  uuid: string;
  companyIDFK: string;
  serviceIDFK: string;
  company: CompanyResponse;
  service: ServiceResponse;
}
