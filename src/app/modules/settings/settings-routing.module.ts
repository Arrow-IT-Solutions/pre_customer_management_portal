import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { AddSettingComponent } from './add-setting/add-setting.component';

const routes: Routes = [
  {
    path:"",
    component:SettingsComponent
  },
  {
    path:"add-setting",
    component:AddSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
