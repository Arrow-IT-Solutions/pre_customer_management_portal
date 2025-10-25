import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { Subject } from 'rxjs';
import { CompanyRequest, CompanyResponse, CompanySearchRequest, CompanyUpdateRequest } from 'src/app/modules/companies/companies.module';


@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

public SelectedData: CompanyResponse | null = null;
  public Dialog: any | null = null;
  private refreshCompaniesSubject = new Subject<void>();

  refreshCompanies$ = this.refreshCompaniesSubject.asObservable();

  triggerRefreshCompanies() {
    this.refreshCompaniesSubject.next();
  }
  constructor(public layoutService: LayoutService, public httpClient: HttpClientService) { }

      async Add(data: CompanyRequest) {
      const apiUrl = `/api/company`;

      return await this.httpClient.post(apiUrl, data);
    }

  async Search(filter: CompanySearchRequest) {

    const apiUrl = `/api/company/list?${this.layoutService.Filter(filter)}`;

      return await this.httpClient.get(apiUrl)

  }

      async Update(data: CompanyUpdateRequest) {

      const apiUrl = `/api/company`;
      return await this.httpClient.put(apiUrl, data);
    }

        async Delete(uuid: string) {

      const apiUrl = `/api/company/${uuid}`;
      return await this.httpClient.delete(apiUrl, uuid);

    }

    async getCompanyById(uuid: string) {
     const apiUrl = `/api/company/${uuid}`;
     return await this.httpClient.get(apiUrl);
    }

}
