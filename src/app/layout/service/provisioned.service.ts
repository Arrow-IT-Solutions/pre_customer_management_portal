import { Injectable } from '@angular/core';
import { ProvisionedServiceRequest, ProvisionedServiceSearchRequest, ProvisionedServiceUpdateRequest, ProvisionedSession } from 'src/app/modules/wizard-to-add/wizard-to-add.module';
import { LayoutService } from './layout.service';
import { HttpClientService } from 'src/app/Core/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProvisionedService {

 private session: ProvisionedSession | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
   setSession(sess: ProvisionedSession) {
    this.session = sess;
    sessionStorage.setItem('provisionedSession', JSON.stringify(sess));
  }
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

  getSession(): ProvisionedSession {
    if (!this.session) {
      const data = sessionStorage.getItem('provisionedSession');
      if (data) {
        this.session = JSON.parse(data);
      }
    }
    if (!this.session) {
      throw new Error('Provisioned session has not been initialized!');
    }
    return this.session;
  }
  clearSession() {
    this.session = null;
    sessionStorage.removeItem('provisionedSession');
  }
        async Add(data: ProvisionedServiceRequest) {
          const apiUrl = `/api/customerService/AddBulk`;

          return await this.httpClient.post(apiUrl, data);
        }

          async Search(filter: ProvisionedServiceSearchRequest) {

            const apiUrl = `/api/customerService/GetBulk?${this.layoutService.Filter(filter)}`;

              return await this.httpClient.get(apiUrl)

          }

              async Update(data: ProvisionedServiceUpdateRequest) {

              const apiUrl = `/api/customerService/UpdateBulk`;
              return await this.httpClient.put(apiUrl, data);
            }

                async Delete(uuid: string) {

              const apiUrl = `/api/customerService/Bulk${uuid}`;
              return await this.httpClient.delete(apiUrl, uuid);

            }
}
