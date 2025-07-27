import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyServicesComponent } from './company-services/company-services.component';

const routes: Routes = [
  {
    path:'',
    component:CompanyServicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyServiceRoutingModule { }
