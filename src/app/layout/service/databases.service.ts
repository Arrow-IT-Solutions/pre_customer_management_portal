import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { DatabaseRequest,DatabaseResponse,DatabaseSearchRequest,DatabaseUpdateRequest } from 'src/app/modules/data-bases/data-bases.module';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public SelectedData: DatabaseResponse | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: DatabaseRequest) {
    const apiUrl = `/api/database`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: DatabaseUpdateRequest) {

    const apiUrl = `/api/database`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/database/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: DatabaseSearchRequest) {

    const apiUrl = `/api/database/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }


}
