import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import {
  SubscriptionRequest,
  SubscriptionResponse,
  SubscriptionSearchRequest,
  SubscriptionUpdateRequest
} from 'src/app/modules/subscription/subscription.module';
import { UserService } from './user.service';
import { HttpClientService } from './http-client.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  public SelectedData: SubscriptionResponse | null = null;
  public Dialog: any | null = null;
 private refreshList = new Subject<void>();
  refreshList$ = this.refreshList.asObservable();

   triggerRefreshSubscription() {
    this.refreshList.next();
  }
  constructor(
    public layoutService: LayoutService,
    public userService: UserService,
    public httpClient: HttpClientService
  ) {}

  async Add(data: SubscriptionRequest) {
    const apiUrl = `/api/subscriptions`;
    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: SubscriptionUpdateRequest) {
    const apiUrl = `/api/subscriptions`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {
    const apiUrl = `/api/subscriptions/${uuid}`;
    return await this.httpClient.delete(apiUrl);
  }

  async Search(filter: SubscriptionSearchRequest) {
    const apiUrl = `/api/subscriptions/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl);
  }
}
