import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { CredentialRequest,CredentialResponse,CredentialSearchRequest,CredentialUpdateRequest } from 'src/app/modules/credential/credential.module';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  public SelectedData: CredentialResponse | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: CredentialRequest) {
    const apiUrl = `/api/credential`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: CredentialUpdateRequest) {

    const apiUrl = `/api/credential`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/credential/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: CredentialSearchRequest) {

    const apiUrl = `/api/credential/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }


}
