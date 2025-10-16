import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenewsComponent } from './renews/renews.component';

const routes: Routes = [
  {
    path:'',
    component:RenewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewsRoutingModule { }
