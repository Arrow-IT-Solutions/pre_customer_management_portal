import { NgModule ,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCardComponent } from './view-card-header-count/view-card.component';
import { SharedModule } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { CardHeaderCountLoadingComponent } from 'src/app/card-header-count-loading/card-header-count-loading.component';
import { NgPrimeModule } from 'src/app/shared/ngprime.module';




@NgModule({
  declarations: [
     CardHeaderCountLoadingComponent,
      ViewCardComponent,
    
  ],
  imports: [
    CommonModule,
    NgPrimeModule
  ],
  exports:[
     CardHeaderCountLoadingComponent,
     ViewCardComponent,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedComponentModule { }
