import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { HttpClientService } from './http-client.service';
import { NotificationRequest, NotificationResponse, NotificationSearchRequest, NotificationUpdateRequest } from 'src/app/modules/notification/notification.module';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public SelectedData: NotificationResponse | null = null;
  public Dialog: any | null = null;
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

  async Add(data: NotificationRequest) {
    const apiUrl = `/api/notification`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: NotificationUpdateRequest) {

    const apiUrl = `/api/notification`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/notification/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: NotificationSearchRequest) {

    const apiUrl = `/api/notification/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }
}
