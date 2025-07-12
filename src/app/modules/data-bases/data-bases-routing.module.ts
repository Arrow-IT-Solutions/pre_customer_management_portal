import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataBasesComponent } from './data-bases/data-bases.component';

const routes: Routes = [
  {
    path:'',
    component:DataBasesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataBasesRoutingModule { }


