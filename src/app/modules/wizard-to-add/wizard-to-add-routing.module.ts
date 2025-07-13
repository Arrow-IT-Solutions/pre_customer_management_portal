import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './wizard/wizard.component';
import { DefinitionsComponent } from './customer-service/definitions.component';
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
