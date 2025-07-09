import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { PortRequest,PortResponse,PortSearchRequest,PortUpdateRequest } from 'src/app/modules/ports/port.module';

@Injectable({
  providedIn: 'root'
})
export class PortService {
  public SelectedData: PortResponse | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: PortRequest) {
    const apiUrl = `/api/port`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: PortUpdateRequest) {

    const apiUrl = `/api/port`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/port/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: PortSearchRequest) {

    const apiUrl = `/api/port/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }


}
