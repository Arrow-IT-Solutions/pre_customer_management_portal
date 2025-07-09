import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { ServiceResponse, ServiceSearchRequest } from 'src/app/modules/services/services.module';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  Search(filter: ServiceSearchRequest): any {
    throw new Error('Method not implemented.');
  }
  Delete(arg0: string): any {
    throw new Error('Method not implemented.');
  }

  public SelectedData: ServiceResponse | null = null;
  public Dialog: any | null = null;
  
}
