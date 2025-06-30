import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GateComponent } from './gate/gate.component';

const routes: Routes = [
  {
    path: '',
    component: GateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GateRoutingModule { }
