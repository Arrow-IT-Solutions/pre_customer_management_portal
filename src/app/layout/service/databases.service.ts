import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { DataBaseResponse } from 'src/app/modules/data-bases/data-bases.module';


@Injectable({
  providedIn: 'root'
})
export class DataBasesService {

  public SelectedData: DataBaseResponse | null = null;
  public Dialog: any | null = null;
  
}