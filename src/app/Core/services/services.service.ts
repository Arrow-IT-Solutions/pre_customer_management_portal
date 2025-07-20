import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import {
  ServiceRequest,
  ServiceResponse,
  ServiceSearchRequest,
  ServiceUpdateRequest
} from 'src/app/modules/services/services.module';
import { UserService } from './user.service';
import { HttpClientService } from './http-client.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  public SelectedData: ServiceResponse | null = null;
  public Dialog: any | null = null;
  private refreshServicesSubject = new Subject<void>();
  refreshServices$ = this.refreshServicesSubject.asObservable();

  triggerRefreshServices() {
      this.refreshServicesSubject.next();
    }
  constructor(
    public layoutService: LayoutService,
    public userService: UserService,
    public httpClient: HttpClientService
  ) {}

  async Add(data: ServiceRequest) {
    const apiUrl = `/api/service`;
    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: ServiceUpdateRequest) {
    const apiUrl = `/api/service`;
    return await this.httpClient.put(apiUrl, data);
  }

 async Delete(uuid: string) {
  const apiUrl = `/api/service/${uuid}`;
  return await this.httpClient.delete(apiUrl);
}



  async Search(filter: ServiceSearchRequest) {
    const apiUrl = `/api/service/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl);
  }
}
