import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServersComponent } from './servers/servers.component';
import { ServerDetailesComponent } from './server-detailes/server-detailes.component';

const routes: Routes = [
  {
    path:'',
    component:ServersComponent
  },
  {
    path:'server-details',
    component:ServerDetailesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServersRoutingModule { }
