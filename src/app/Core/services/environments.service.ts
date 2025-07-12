import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import {
  EnvironmentRequest,
  EnvironmentResponse,
  EnvironmentSearchRequest,
  EnvironmentUpdateRequest
} from 'src/app/modules/environment/environment.module';  // Adjust path as needed
import { UserService } from './user.service';
import { HttpClientService } from './http-client.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  public SelectedData: EnvironmentResponse | null = null;
  public Dialog: any | null = null;

  constructor(
    public layoutService: LayoutService,
    public userService: UserService,
    public httpClient: HttpClientService
  ) {}

  private refreshEmployeesSubject = new Subject<void>();
  
    refreshEmployees$ = this.refreshEmployeesSubject.asObservable();
  
    triggerRefreshEnvironment() {
        this.refreshEmployeesSubject.next();
      }
  async Add(data: EnvironmentRequest) {
    const apiUrl = `/api/environment`;
    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: EnvironmentUpdateRequest) {
    const apiUrl = `/api/environment`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {
    const apiUrl = `/api/environment/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid);
  }

  async Search(filter: EnvironmentSearchRequest) {
    const apiUrl = `/api/environment/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl);
  }
  
}
