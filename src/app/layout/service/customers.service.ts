import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { CustomerRequest, CustomerResponse, CustomerSearchRequest, CustomerUpdateRequest } from 'src/app/modules/customers/customers.module';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

public SelectedData: CustomerResponse | null = null;
  public Dialog: any | null = null;
  private refreshCustomersSubject = new Subject<void>();

  refreshCustomers$ = this.refreshCustomersSubject.asObservable();

  triggerRefreshCustomers() {
    this.refreshCustomersSubject.next();
  }
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

      async Add(data: CustomerRequest) {
      const apiUrl = `/api/customer`;

      return await this.httpClient.post(apiUrl, data);
    }

  async Search(filter: CustomerSearchRequest) {

    const apiUrl = `/api/customer/list?${this.layoutService.Filter(filter)}`;

      return await this.httpClient.get(apiUrl)

  }

      async Update(data: CustomerUpdateRequest) {

      const apiUrl = `/api/customer`;
      return await this.httpClient.put(apiUrl, data);
    }

        async Delete(uuid: string) {

      const apiUrl = `/api/customer/${uuid}`;
      return await this.httpClient.delete(apiUrl, uuid);

    }

}
