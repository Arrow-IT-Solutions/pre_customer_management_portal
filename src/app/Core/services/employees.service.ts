import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { HttpClientService } from './http-client.service';
import { EmployeeRequest, EmployeeSearchRequest, EmployeeUpdateRequest, EmployeesResponse } from 'src/app/modules/employees/employees.module';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  public SelectedData: EmployeesResponse | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";
    private refreshEmployeesSubject = new Subject<void>();

  refreshEmployees$ = this.refreshEmployeesSubject.asObservable();

  triggerRefreshEmployees() {
      this.refreshEmployeesSubject.next();
    }
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }
  async Add(data: EmployeeRequest) {
    const apiUrl = `/api/employee`;

    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: EmployeeUpdateRequest) {

    const apiUrl = `/api/employee`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {

    const apiUrl = `/api/employee/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid)

  }

  async Search(filter: EmployeeSearchRequest) {

    const apiUrl = `/api/employee/list?${this.layoutService.Filter(filter)}`;

    return await this.httpClient.get(apiUrl)

  }


}
