import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResponseBase, RequestBase, SearchRequestBase } from 'src/app/shared/class/class';
import { AddSettingComponent } from './add-setting/add-setting.component';


@NgModule({
  declarations: [
    SettingsComponent,
    AddSettingComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
export interface SettingResponse extends ResponseBase {

  uuid?: string;
  settingTranslation?: { [key: string]: SettingTranslationResponse };
  phone: string,
  appURL: string,
  logo: string,
  backgroundImage: string,
  instagramLink: string,
  facebookLink: string,
}
export interface SettingSearchRequest extends SearchRequestBase {
  uuid?: string;
  name?: string;
  subtitle?: string;

}
export interface SettingUpdateRequest extends RequestBase {
  settingTranslation?: SettingTranslationRequest[];
  phone: string,
  appURL: string,
  logo: string,
  backgroundImage: string,
  instagramLink: string,
  facebookLink: string,

}

export interface SettingRequest extends RequestBase {
  settingTranslation?: SettingTranslationRequest[];
  phone: string,
  appURL: string,
  logo: string,
  backgroundImage: string,
  instagramLink: string,
  facebookLink: string,

}

export interface SettingTranslationResponse {
  uuid?: string;
  name?: string;
  subtitle?: string;
  language?: string;
}
export interface SettingTranslationRequest {
  uuid?: string;
  name?: string;
  subtitle?: string;
  language?: string;
}
export interface SettingTranslationUpdateRequest {
  uuid?: string;
  name?: string;
  subtitle?: string;
}
