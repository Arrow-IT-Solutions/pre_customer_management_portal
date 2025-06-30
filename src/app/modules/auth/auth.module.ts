import { NgModule } from '@angular/core';
import { LoginComponent } from './page/login/login.component';
import { AuthRoutingModule } from './auth.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  RequestBase,
  ResponseBase,
  SearchRequestBase,
} from '../../shared/class/class';

@NgModule({
  declarations: [LoginComponent],
  imports: [AuthRoutingModule, SharedModule],
})
export class AuthModule { }

export interface AuthRequest {
  userName: string;
  password: string;
  platformType: string
  countryCode?: string
}

export interface CurrentUser {
  userUUID: string;
  userName: string;
  userType: string,
  token: string,
  loggedInUser: string
}

export interface resetPasswordRequest {
  userNameType: string;
  userName: string;
}

export interface UserRequest extends RequestBase {

  uuid?: string;
  userTranslation?: UserTranslationRequest[];
  roleIDFK?: string;
  username?: string;
  userType?: string;
  password?: string;
  userStatus?: string;
  isForceLogout?: string;
  deviceType?: string;
  oTP?: string;
  isTermsApproved?: string;
  notificationToken?: string;
  isVerified?: string;
  isBlocked?: string;
}

export interface UserResponse extends ResponseBase {
  uuid?: string;
  userTranslation?: { [key: string]: UserTranslationResponse };
  userType?: string;
  userTypeValue?: string;
  roleIDFK: string;
  username?: string;
  userStatus: string;
  userStatusValue?: string;
  isForceLogout: string;
  isForceLogoutValue: string;
  deviceType: string;
  oTP: string;
  isTermsApproved: string;
  isTermsApprovedValue: string;
  notificationToken: string;
  isVerified?: string;
  isVerifiedValue?: string;
  isBlocked?: string;
  isBlockedValue?: string;
  countryCode: string,
}

export interface UserSearchRequest extends SearchRequestBase {
  uuid?: string;
  name?: string;
  userType?: string;
  isTermsApproved?: string;
  userStatus?: string;
  includeRole?: string;
  includeNotifications?: string;
  includeFeedback?: string;
}

export interface UserTranslationResponse {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}
export interface UserTranslationRequest {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}
export interface UserTranslationUpdateRequest {
  uuid?: string;
  firstName?: string;
  lastName?: string;
  language?: string
}


