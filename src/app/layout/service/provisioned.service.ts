import { Injectable } from '@angular/core';
import { ProvisionedServiceRequest, ProvisionedSession } from 'src/app/modules/wizard-to-add/wizard-to-add.module';
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
}
