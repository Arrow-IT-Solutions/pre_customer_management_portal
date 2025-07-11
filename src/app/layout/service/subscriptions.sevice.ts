import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/Core/services/http-client.service';
import { LayoutService } from './layout.service';
import { SubscriptionResponse } from 'src/app/modules/subscription/subscription.module';


@Injectable({
  providedIn: 'root'
})
export class SubscripeService {

  public SelectedData: SubscriptionResponse | null = null;
  public Dialog: any | null = null;
  
}