import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { Subject } from 'rxjs';
import { ApplicationRequest, ApplicationResponse, ApplicationSearchRequest, ApplicationUpdateRequest } from 'src/app/modules/application/application.module';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  public SelectedData: ApplicationResponse | null = null;
  public Dialog: any | null = null;
  private refreshApplicationsSubject = new Subject<void>();

  refreshApplications$ = this.refreshApplicationsSubject.asObservable();

  triggerRefreshApplications() {
    this.refreshApplicationsSubject.next();
  }
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

        async Add(data: ApplicationRequest) {
        const apiUrl = `/api/appliction`;

        return await this.httpClient.post(apiUrl, data);
      }

  async Search(filter: ApplicationSearchRequest) {

    const apiUrl = `/api/appliction/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }

    async Update(data: ApplicationUpdateRequest) {

        const apiUrl = `/api/appliction`;
        return await this.httpClient.put(apiUrl, data);
      }

    async Delete(uuid: string) {

        const apiUrl = `/api/appliction/${uuid}`;
        return await this.httpClient.delete(apiUrl, uuid);

      }
}
