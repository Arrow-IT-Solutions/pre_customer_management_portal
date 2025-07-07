import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CredentialComponent } from './credential/credential.component';

const routes: Routes = [
  {
    path:'',
    component:CredentialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CredentialRoutingModule { }
