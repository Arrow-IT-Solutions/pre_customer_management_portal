import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnvironmentComponent } from './environment/environment.component';
import { AddEnvironmentComponent } from './add-environment/add-environment.component';

const routes: Routes = [
  {
    path: '',
    component: EnvironmentComponent
  },
  {
    path: 'add',
    component: AddEnvironmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironmentRoutingModule { }
