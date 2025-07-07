import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './wizard/wizard.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { VariantsComponent } from './variants/variants.component';

const routes: Routes = [
   {
    path:'',
    component:WizardComponent,
    children: [
      {
        path: 'definitions',
        component:DefinitionsComponent,
      },
      {
        path: 'variants',
        component:VariantsComponent,
      },
    ],
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardToAddRoutingModule { }
