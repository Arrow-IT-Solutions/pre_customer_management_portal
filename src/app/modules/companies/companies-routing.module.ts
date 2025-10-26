import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies/companies.component';
import { AgentsListComponent } from './agents-list/agents-list.component';

const routes: Routes = [
  {
    path:'',
    component:CompaniesComponent
  },
    {
      path:'agents-list',
      component:AgentsListComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
