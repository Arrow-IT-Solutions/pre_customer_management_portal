import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { UserService } from './user.service';

import Axios from 'axios';
import { UserResponse } from 'src/app/modules/auth/auth.module';
import { environment } from 'src/environments/environment';
import { HttpClientService } from './http-client.service';
import { CenterResponse, CenterRequest, CenterUpdateRequest, CenterSearchRequest } from 'src/app/modules/centers/centers.module';

@Injectable({
  providedIn: 'root'
})
export class CenterService {
  public SelectedData: CenterResponse | null = null;
  public Dialog: any | null = null;

  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) {}

  async Add(data: CenterRequest) {
    const apiUrl = `/api/center`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: CenterUpdateRequest) {
    const apiUrl = `/api/center`;
    return await this.httpClient.put(apiUrl, data);
  }

  async deleteCenter(data: CenterUpdateRequest) {
    const apiUrl = `/api/center`;
    return await this.httpClient.delete(apiUrl, data);
  }

  async Search(filter: CenterSearchRequest) {
    const apiUrl = `/api/center/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl);
  }
}
