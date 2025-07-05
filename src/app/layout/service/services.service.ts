import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { ServiceResponse } from 'src/app/modules/services/services.module';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  public SelectedData: ServiceResponse | null = null;
  public Dialog: any | null = null;
  
}
