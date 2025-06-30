import { Injectable } from '@angular/core';
import { LayoutService } from '../../layout/service/layout.service';
import { LocalService } from '../../shared/service/local.service';
import Axios from 'axios';
import { CurrentUser, UserRequest, UserResponse, UserSearchRequest, resetPasswordRequest } from '../../modules/auth/auth.module';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userResponse: UserResponse;

  currentUser: CurrentUser;


  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

  async Search(filter: UserSearchRequest) {

    const apiUrl = `/api/user/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl);

  }

  async resetPassword(data: any) {

    const apiUrl = `/api/user/ResetPassword`;

    return await this.httpClient.post(apiUrl, data);
  }

  async isVerified(data: any) {

    const apiUrl = `/api/user/IsVerified`;

    return await this.httpClient.post(apiUrl, data)
  }

  async reSendOTP(data: any) {

    const apiUrl = `/api/user/ReSendOTP`;

    return await this.httpClient.post(apiUrl, data);
  }

  async updateUser(data: any) {

    const apiUrl = `/api/user`;

    return await this.httpClient.put(apiUrl, data);
  }

  async EmployeeResetPass(data: any) {

    const apiUrl = `/api/user/employeeResetPassword`;

    return await this.httpClient.put(apiUrl, data);
  }

  async addUser(data: UserRequest) {


    const apiUrl = `/api/user`;

    return await this.httpClient.post(apiUrl, data);
  }

  async GetLoggedInUser(id: string) {
    var search = {
      id: id
    };
    const response = await this.Search(search);

    console.log('getLoggedIn search User : ', response);

    if (response.requestStatus == 200) {
      return await response.data[0];
      console.log('response.data[0]', response.data[0]);
    } else {
      console.log('getLoggedInUser error');
    }
  }


}
