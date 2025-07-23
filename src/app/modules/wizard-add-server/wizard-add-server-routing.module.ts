import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './wizard/wizard.component';
import { ServerComponent } from './server/server.component';
import { ApplicationComponent } from './application/application.component';

const routes: Routes = [
  {
      path:'',
      component:WizardComponent,
      children: [
        {
          path: 'server-data',
          component:ServerComponent
        },
      
        {
          path: 'application',
          component:ApplicationComponent,
        },
      ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardAddServerRoutingModule { }
