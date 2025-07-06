import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { PortResponse } from 'src/app/modules/ports/port.module';


@Injectable({
  providedIn: 'root'
})
export class PortsService {

  public SelectedData: PortResponse | null = null;
  public Dialog: any | null = null;
  
}