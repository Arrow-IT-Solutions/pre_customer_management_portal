import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './wizard/wizard.component';
import { DefinitionsComponent } from './customer-service/definitions.component';
import { VariantsComponent } from './subsription/variants.component';
import { EnvironmentComponent } from './environment/environment.component';

const routes: Routes = [
   {
    path:'',
    component:WizardComponent,
    children: [
      {
        path: 'customer-service',
        component:DefinitionsComponent,
      },
      {
        path: 'subscription',
        component:VariantsComponent,
      },
       {
        path: 'environment',
        component:EnvironmentComponent,
      },
    ],
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardToAddRoutingModule { }
