import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { ServersResponse } from 'src/app/modules/servers/servers.module';


@Injectable({
  providedIn: 'root'
})
export class ServersService {

  public SelectedData: ServersResponse | null = null;
  public Dialog: any | null = null;
  
}
