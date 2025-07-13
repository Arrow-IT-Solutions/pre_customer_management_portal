import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerServicesComponent } from './customer-services/customer-services.component';

const routes: Routes = [
  {
    path:'',
    component:CustomerServicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerServiceRoutingModule { }
