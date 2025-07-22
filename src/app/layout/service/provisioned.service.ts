import { Injectable } from '@angular/core';
import { ProvisionedServiceRequest, ProvisionedServiceSearchRequest, ProvisionedServiceUpdateRequest, ProvisionedSession } from 'src/app/modules/wizard-to-add/wizard-to-add.module';
import { LayoutService } from './layout.service';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvisionedService {

  private session: ProvisionedSession | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
  
  private saveEnvironmentDataSubject = new Subject<void>();
  private saveCustomerServiceDataSubject = new Subject<void>();
  
  private validateCustomerServiceFormSubject = new Subject<{resolve: (value: boolean) => void}>();
  
  public saveEnvironmentData$ = this.saveEnvironmentDataSubject.asObservable();
  public saveCustomerServiceData$ = this.saveCustomerServiceDataSubject.asObservable();
  public validateCustomerServiceForm$ = this.validateCustomerServiceFormSubject.asObservable();
  
  setSession(sess: ProvisionedSession) {
    this.session = sess;
    try {
      sessionStorage.setItem('provisionedSession', JSON.stringify(sess));
      console.log('ProvisionedService: Session saved successfully');
    } catch (error) {
      console.log('ProvisionedService: Error saving session to storage:', error);
    }
  }
  
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

  getSession(): ProvisionedSession {
    if (!this.session) {
      try {
        const data = sessionStorage.getItem('provisionedSession');
        if (data) {
          this.session = JSON.parse(data);
          console.log('ProvisionedService: Session restored from storage');
        }
      } catch (error) {
        console.log('ProvisionedService: Error reading session from storage:', error);
      }
    }
    if (!this.session) {
      throw new Error('Provisioned session has not been initialized!');
    }
    return this.session;
  }
  
  clearSession() {
    this.session = null;
    try {
      sessionStorage.removeItem('provisionedSession');
      console.log('ProvisionedService: Session cleared successfully');
    } catch (error) {
      console.log('ProvisionedService: Error clearing session:', error);
    }
  }

  triggerSaveEnvironmentData() {
    console.log('ProvisionedService: Triggering save environment data...');
    this.saveEnvironmentDataSubject.next();
  }

  triggerSaveCustomerServiceData() {
    console.log('ProvisionedService: Triggering save customer service data...');
    this.saveCustomerServiceDataSubject.next();
  }

  async validateCustomerServiceForm(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('ProvisionedService: Triggering customer service form validation...');
      let resolved = false;
      
      const resolveOnce = (value: boolean) => {
        if (!resolved) {
          resolved = true;
          resolve(value);
        }
      };
      
      this.validateCustomerServiceFormSubject.next({ resolve: resolveOnce });
      
      setTimeout(() => {
        if (!resolved) {
          console.log('ProvisionedService: Validation timeout - assuming invalid');
          resolveOnce(false);
        }
      }, 1000);
    });
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
    const response = await this.httpClient.put(apiUrl, data);
    return response;
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/customerService/Bulk${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid);

  }
}
