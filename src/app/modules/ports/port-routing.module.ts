import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortsComponent } from './ports/ports.component';

const routes: Routes = [
  {
    path:'',
    component:PortsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortRoutingModule { }
