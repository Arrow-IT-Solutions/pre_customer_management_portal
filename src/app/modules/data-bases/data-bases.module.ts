import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPrimeModule } from 'src/app/shared/ngprime.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AddDatabaseComponent } from './add-database/add-database.component';
import { DataBasesComponent } from './data-bases/data-bases.component';
import { DataBasesRoutingModule } from './data-bases-routing.module';
import { RequestBase, ResponseBase } from 'src/app/shared/class/class';
import { ConfirmationService } from 'primeng/api';
import { EnvironmentResponse } from '../environment/environment.module';


@NgModule({
  declarations: [
    DataBasesComponent,
    AddDatabaseComponent
  ],
  imports: [
    CommonModule,
    DataBasesRoutingModule,

    ReactiveFormsModule,
    NgPrimeModule,
    TranslateModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class DataBasesModule { }
export interface DatabaseRequest extends RequestBase {
  uuid?: string;
  name?: string;
  userName?: string;
  connectionString?: string;
  password?: string;
  envIDFK?: string;
}

export interface DatabaseUpdateRequest extends RequestBase {
  uuid?: string;
  name?: string;
  userName?: string;
  connectionString?: string;
  password?: string;
  envIDFK?: string;
}

export interface DatabaseSearchRequest extends RequestBase {
  uuid?: string;
  name?: string;
  userName?: string;
  connectionString?: string;
  password?: string;
  envIDFK?: string;
  includeEnvironment: string
}

export interface DatabaseResponse extends ResponseBase {
  uuid?: string;
  requestStatus?: string;
  requestMessage?: string;
  userName?: string;
  password?: string;
  name?: string;
  connectionString?: string;
  environment?: EnvironmentResponse;
}
