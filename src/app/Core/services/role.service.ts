import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { UserService } from './user.service';

import Axios from 'axios';
import { UserResponse } from 'src/app/modules/auth/auth.module';
import { RoleRequest, RoleResponse, RoleSearchRequest, RoleUpdateRequest } from 'src/app/modules/employess/pages/roles/roles.module';
import { environment } from 'src/environments/environment';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public SelectedData: RoleResponse | null = null;
  public Dialog: any | null = null;


  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) {}

  async Add(data: RoleRequest) {
    const apiUrl = `/api/role`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: RoleUpdateRequest) {

    const apiUrl = `/api/role`;
    return await this.httpClient.put(apiUrl, data);
  }

  async deleteRole(data: RoleUpdateRequest) {

    const apiUrl = `/api/role`;
    return await this.httpClient.delete(apiUrl, data)

  }

  async Search(filter: RoleSearchRequest) {

    const apiUrl = `/api/role/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)
     
  }
}
