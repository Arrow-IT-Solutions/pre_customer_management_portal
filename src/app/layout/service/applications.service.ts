import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ApplicationRequest,ApplicationResponse,ApplicationSearchRequest,ApplicationUpdateRequest } from 'src/app/modules/applications/application.module';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public SelectedData: ApplicationResponse | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: ApplicationRequest) {
    const apiUrl = `/api/application`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: ApplicationUpdateRequest) {

    const apiUrl = `/api/application`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/application/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: ApplicationSearchRequest) {

    const apiUrl = `/api/application/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }


}
