import { Injectable } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { HttpClientService } from './http-client.service';
import { AgentRequest, AgentSearchRequest, AgentUpdateRequest, AgentResponse } from 'src/app/modules/agent/agent.module';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  public SelectedData: AgentResponse | null = null;
  public Dialog: any | null = null;
  public submitted: any | null = "";

  private refreshAgentsSubject = new Subject<void>();
  refreshAgents$ = this.refreshAgentsSubject.asObservable();

  triggerRefreshAgents() {
    this.refreshAgentsSubject.next();
  }

  constructor(
    public layoutService: LayoutService,
    public httpClient: HttpClientService
  ) {}

  async Add(data: AgentRequest) {
    const apiUrl = `/api/agent`;
    return await this.httpClient.post(apiUrl, data);
  }

  async Update(data: AgentUpdateRequest) {
    const apiUrl = `/api/agent`;
    return await this.httpClient.put(apiUrl, data);
  }

  async Delete(uuid: string) {
    const apiUrl = `/api/agent/${uuid}`;
    return await this.httpClient.delete(apiUrl, uuid);
  }

  async Search(filter: AgentSearchRequest) {
    const apiUrl = `/api/agent/list?${this.layoutService.Filter(filter)}`;
    return await this.httpClient.get(apiUrl);
  }

async getAgentsByCompanyID(uuid: string, pageIndex = 0, pageSize = 10) {
  const apiUrl = `/api/agent/list?companyIDFK=${uuid}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
  return await this.httpClient.get(apiUrl);
}
}
