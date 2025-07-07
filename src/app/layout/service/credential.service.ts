import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { CredentialResponse } from 'src/app/modules/credential/credential.module';


@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  public SelectedData: CredentialResponse | null = null;
  public Dialog: any | null = null;
  
}