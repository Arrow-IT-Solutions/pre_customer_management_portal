import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { UserService } from './user.service';

import Axios from 'axios';
import { UserResponse } from 'src/app/modules/auth/auth.module';
import { DriverRequest, DriverResponse, DriverSearchRequest, DriverUpdateRequest } from 'src/app/modules/drivers/drivers.module';
import { environment } from 'src/environments/environment';
import { HttpClientService } from './http-client.service';
import { PrintReportRequest } from 'src/app/modules/licensing/licensing-routing.module';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public SelectedData: DriverResponse | null = null;
  public Dialog: any | null = null;
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

  async ExpiredLicenceReport(filter: DriverSearchRequest) {

    const apiUrl = `/api/report/expiredLicenceReport?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }

  async Add(data: PrintReportRequest) {
    const apiUrl = `/api/report`;

    return await this.httpClient.post(apiUrl, data);
  }
}
