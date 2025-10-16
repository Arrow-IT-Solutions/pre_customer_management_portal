import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyServicesComponent } from './company-services/company-services.component';
import { ServicesDetailsComponent } from './services-details/services-details.component';
import { AlertModelComponent } from './alert-model/alert-model.component';

const routes: Routes = [
  {
    path:'',
    component:CompanyServicesComponent
  },
  {
    path:'services-details',
    component:ServicesDetailsComponent
  },
  {
    path:'alert-model',
    component:AlertModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyServiceRoutingModule { }
