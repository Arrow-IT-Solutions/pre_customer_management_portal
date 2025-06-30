import { Injectable } from "@angular/core";
import { LayoutService } from 'src/app/layout/service/layout.service';
import { HttpClientService } from "src/app/Core/services/http-client.service";
import { SettingResponse, SettingRequest, SettingSearchRequest, SettingUpdateRequest } from "src/app/modules/settings/settings.module";
@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  public SelectedData: SettingResponse | null = null;
  public Dialog: any | null = null;
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: SettingRequest) {
    const apiUrl = `/api/setting`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: SettingUpdateRequest) {

    const apiUrl = `/api/setting`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/setting/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: SettingSearchRequest) {

    const apiUrl = `/api/setting/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }
}
