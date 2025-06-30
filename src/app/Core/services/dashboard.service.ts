import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { HttpClientService } from './http-client.service';
import { DashboardResponse, DashboardSearchRequest } from 'src/app/modules/dashboard/dashboard.module';

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  public SelectedData: DashboardResponse | null = null;
  public Dialog: any | null = null;
  constructor(
    public layoutService: LayoutService,
    public httpClient: HttpClientService) { }

  async Search(filter: DashboardSearchRequest) {

    const apiUrl = `/api/dashboard/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }


}
