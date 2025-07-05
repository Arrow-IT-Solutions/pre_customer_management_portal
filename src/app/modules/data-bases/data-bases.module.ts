import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataBasesRoutingModule } from './data-bases-routing.module';
import { DataBasesComponent } from './data-bases/data-bases.component';
import { AddDatabaseComponent } from './add-database/add-database.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponseBase } from 'src/app/shared/class/class';


@NgModule({
  declarations: [
    DataBasesComponent,
    AddDatabaseComponent
  ],
  imports: [
    CommonModule,
    DataBasesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DataBasesModule { }
export interface DataBaseResponse extends ResponseBase {
  
}
