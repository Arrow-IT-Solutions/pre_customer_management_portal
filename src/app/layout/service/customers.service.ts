import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { CustomerResponse } from 'src/app/modules/customers/customers.module';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  public SelectedData: CustomerResponse | null = null;
  public Dialog: any | null = null;
  
}