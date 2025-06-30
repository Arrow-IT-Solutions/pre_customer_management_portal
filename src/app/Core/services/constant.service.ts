import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import Axios from 'axios';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  constructor(
    public layoutService: LayoutService,
    public userService: UserService,
    public httpClient: HttpClientService
  ) { }

  // async Search(name: string) {
  //   const config = {
  //     headers: {
  //       'Accept-Language': this.layoutService.config.lang,
  //       Authorization: 'Bearer ' + this.userService.currentUser.token,
  //     },
  //   };

  //   const apiUrl = `${this.layoutService.baseApiUrl
  //     }/api/constants?${this.layoutService.Filter({ enumName: name })}`;

  //   return Axios.get(apiUrl, config)
  //     .then((response) => {
  //       console.log('r', response);

  //       return response.data;
  //     })
  //     .catch((error) => {
  //       console.log('rr', error);
  //       return error.response.data;
  //     });
  // }


  async Search(name: string, isDefault: Number = 0) {
console.log('isDefault', isDefault);
    const apiUrl = `/api/constants?${this.layoutService.Filter({ enumName: name, addDefault: isDefault.toString(), isDefaultOptionAll: isDefault })}`;

    return await this.httpClient.get(apiUrl)

  }

}
export interface ConstantResponse {
  key?: string;
  value?: string;
  color?: string;
}
