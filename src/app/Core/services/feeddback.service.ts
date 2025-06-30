import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { HttpClientService } from './http-client.service';
import { FeedbackRequest, FeedbackResponse, FeedbackSearchRequest, FeedbackUpdateRequest } from 'src/app/modules/feedback/feedBacks.module';

@Injectable({
  providedIn: 'root'
})
export class FeeddbackService {

  public SelectedData: FeedbackResponse | null = null;
  public Dialog: any | null = null;
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: FeedbackRequest) {
    const apiUrl = `/api/feedback`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: FeedbackUpdateRequest) {

    const apiUrl = `/api/feedback`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/feedback/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: FeedbackSearchRequest) {

    const apiUrl = `/api/feedback/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }
}
