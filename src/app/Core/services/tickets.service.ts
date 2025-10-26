import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import {
  TicketRequest,
  TicketResponse,
  TicketSearchRequest,
  TicketUpdateRequest
} from 'src/app/modules/ticket/ticket.module';
import { UserService } from './user.service';
import { HttpClientService } from './http-client.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  public SelectedData: TicketResponse | null = null;
  public Dialog: any | null = null;
  private refreshTicketsSubject = new Subject<void>();
  refreshServices$ = this.refreshTicketsSubject.asObservable();

  triggerRefreshTickets() {
      this.refreshTicketsSubject.next();
    }
  constructor(
    public layoutService: LayoutService,
    public userService: UserService,
    public httpClient: HttpClientService
  ) {}

  async Add(data: TicketRequest) {
    const apiUrl = `/api/ticket`;
    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: TicketUpdateRequest) {
    const apiUrl = `/api/ticket`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {
  const apiUrl = `/api/ticket/${uuid}`;
  return await this.httpClient.delete(apiUrl);
}



  async Search(filter: TicketSearchRequest) {
    const apiUrl = `/api/ticket/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl);
  }
}
