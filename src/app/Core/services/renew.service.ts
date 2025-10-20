import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { UserService } from './user.service';
import { RenewRequest, RenewResponse, RenewSearchRequest } from 'src/app/modules/renews/renews.module';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class RenewService {
  public SelectedData:RenewResponse |null=null;
  public Dialog: any | null = null;
  constructor(
    public layoutService:LayoutService,
    public userService:UserService,
    public httpClient: HttpClientService

  ) { }


   async Add(data: RenewRequest) {
      const apiUrl = `/api/renew`;
  
      return await this.httpClient.post(apiUrl, data);
    }
     async Update(data: RenewRequest) {
      const apiUrl = `/api/renew`;
  
      return await this.httpClient.put(apiUrl, data);
    }
     async Search(filter: RenewSearchRequest) {
    
        const apiUrl = `/api/renew/list?${this.layoutService.Filter(filter)}`;
    
        return await this.httpClient.get(apiUrl)
    
      }
      async Delete(uuid: string) {

    const apiUrl = `/api/renew/${uuid}`;
    return await this.httpClient.delete(apiUrl)

  }

   
}
