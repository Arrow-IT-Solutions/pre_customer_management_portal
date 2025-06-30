import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { UserService } from './user.service';

import Axios from 'axios';
import { UserResponse } from 'src/app/modules/auth/auth.module';
import { environment } from 'src/environments/environment';
import { HttpClientService } from './http-client.service';
import { CashierResponse, CashierRequest, CashierUpdateRequest, CashierSearchRequest } from 'src/app/modules/employess/pages/cashier/cashier.module';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  public SelectedData: CashierResponse | null = null;
  public Dialog: any | null = null;

  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) {}

  async Add(data: CashierRequest) {
    const apiUrl = `/api/cashier`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: CashierUpdateRequest) {
    const apiUrl = `/api/cashier`;
    return await this.httpClient.put(apiUrl, data);
  }

  async deleteCashier(data: CashierUpdateRequest) {
    const apiUrl = `/api/cashier`;
    return await this.httpClient.delete(apiUrl, data);
  }

  async Search(filter: CashierSearchRequest) {
    const apiUrl = `/api/cashier/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl);
  }
}
