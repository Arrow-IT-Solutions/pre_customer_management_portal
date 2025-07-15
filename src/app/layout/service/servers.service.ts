import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { ServerRequest, ServerResponse, ServerSearchRequest, ServerUpdateRequest } from 'src/app/modules/servers/servers.module';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServersService {

  public SelectedData: ServerResponse | null = null;
  public Dialog: any | null = null;
  private refreshServersSubject = new Subject<void>();

  refreshServers$ = this.refreshServersSubject.asObservable();

  triggerRefreshServers() {
    this.refreshServersSubject.next();
  }
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

  async Add(data: ServerRequest) {
    const apiUrl = `/api/server`;
    return await this.httpClient.post(apiUrl, data);
  }

  async Search(filter: ServerSearchRequest) {
    const apiUrl = `/api/server/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl)
  }

  async Update(data: ServerUpdateRequest) {

    const apiUrl = `/api/server`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {
    const apiUrl = `/api/server/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid);
  }
   public submitted: any | null = "";
    constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
    async Add(data: ServerRequest) {
      const apiUrl = `/api/server`;

      return await this.httpClient.post(apiUrl, data);
    }

    async Update(data: ServerUpdateRequest) {

      const apiUrl = `/api/server`;
      return await this.httpClient.put(apiUrl, data);
    }

    async Delete(uuid: string) {

      const apiUrl = `/api/server/${uuid}`;
      return await this.httpClient.delete(apiUrl, uuid)

    }

    async Search(filter: ServerSearchRequest) {

      const apiUrl = `/api/server/list?${this.layoutService.Filter(filter)}`;

      return await this.httpClient.get(apiUrl)

    }
}
