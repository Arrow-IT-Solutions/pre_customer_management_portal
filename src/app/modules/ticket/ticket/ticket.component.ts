import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { TicketsService } from 'src/app/Core/services/tickets.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AgentsService } from 'src/app/Core/services/agents.service';
import { TicketResponse, TicketSearchRequest } from '../ticket.module';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';

import { ActivatedRoute } from '@angular/router';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class TicketComponent {

  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  visible: boolean = false;
  link = '';

  dataForm!: FormGroup;
  data: TicketResponse[] = [];

  loading = false;
  isResetting: boolean = false;

  doneTypingInterval = 1000;
  typingTimer: any;

  agentsList: { label: string; value: string; companyName: string }[] = [];
  companiesList: { label: string; value: string }[] = [];
  agentIDFK?: string;
  companyIDFK?: string;

  status: ConstantResponse[] = [];
  selectedTicket: any = null;
  selectedStatus: string = '';
  displayStatusDialog = false;

  constructor(
    public formBuilder: FormBuilder,
    public ticketsService: TicketsService,
    public agentService: AgentsService,
    public companyService: CompaniesService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public constantService: ConstantService,

    public route: ActivatedRoute
  ){
    this.dataForm = this.formBuilder.group({
      uuid: [''],
      agentName: [''],
      companyName: [''],
      description: ['', Validators.required],
      companyIDFK: [''],
      status: [''],
      fromDate: [''],
      toDate: [''],
    });

    this.ticketsService.refreshServices$.subscribe(() => {
      this.FillData();
    });
  }

  async ngOnInit() {
  
  this.route.queryParams.subscribe(async params => {
    this.agentIDFK = params['agentIDFK'];
    console.log('Agent ID from route:', this.agentIDFK);

    const StatusResponse = await this.constantService.Search('TicketStatus') as any;
    console.log("status value: ", StatusResponse.data)
    this.status =StatusResponse.data;
    await this.retrieveCompanies();
    await this.retrieveAgents();

    await this.FillData();
  });
}

  Search() {
    this.FillData();
  }

  retrieveAgentLabel(row: TicketResponse): string {
      const agentUUID = row.agentIDFK?.trim();
      const match = this.agentsList.find(c => c.value === agentUUID);
      return match?.label || '-';
    }
  
async retrieveAgents() {
  const filter = {
    name: '',
    uuid: '',
    pageIndex: '0',
    pageSize: '10'
  };

  const response = await this.agentService.Search(filter) as any;
  const agents = response?.data || [];
  this.agentsList = agents.map((agent: any) => ({
    label: agent.agentTranslation?.[this.layoutService.config.lang]?.name ?? '—',
    value: agent.uuid?.trim() ?? '',
    companyName: this.companiesList.find(c => c.value === agent.companyIDFK)?.label ?? '—'
  }));

  console.log('agents response:', response);
  console.log('mapped agentsList:', this.agentsList);
}

retrieveCompanyName(row: TicketResponse): string {
  const agentUUID = row.agentIDFK?.trim();
  const match = this.agentsList.find(a => a.value === agentUUID);
  return match?.companyName || '—';
  }

  async retrieveCompanies() {
    const filter = {
      name: '',
      uuid: '',
      pageIndex: '0',
      pageSize: '10'
    };

    const response = await this.companyService.Search(filter) as any;
    const companies = response?.data || [];

    this.companiesList = companies.map((company: any) => ({
      label: company.companyTranslation?.[this.layoutService.config.lang]?.name ?? '—',
      value: company.uuid?.trim() ?? ''
    }));

    console.log('companies response:', response);
    console.log('mapped companiesList:', this.companiesList);

  }

    filterByAgent(agentUUID: string) {
    console.log("agent UUID ", agentUUID)
    this.dataForm.get('agentIDFK')?.setValue(agentUUID);
    this.FillData();
  }

  async FillData(pageIndex: number = 0) {
      this.loading = true;
      this.data = [];
      this.totalRecords = 0;

      let fromDateControl = this.dataForm.controls['fromDate']?.value;
      let toDateControl = this.dataForm.controls['toDate']?.value;

      let fromDateValue = fromDateControl ? new Date(fromDateControl).toISOString() : "";
      let toDateValue = toDateControl ? new Date(toDateControl).toISOString() : "";

      const filter = {
      agentName: this.dataForm?.controls['agentName'].value,
      companyName: this.dataForm?.controls['companyName'].value,
      agentIDFK: this.agentIDFK,
      status: this.dataForm?.controls['status'].value.toString(),
      fromDate: fromDateValue,
      toDate: toDateValue,
      uuid: '',
      pageIndex: '0',
      pageSize: '10'
    };
      const response = (await this.ticketsService.Search(filter)) as any;
      console.log("ticket response: ", response)
      if (response.data == null || response.data.length == 0) {
        this.data = [];
        this.totalRecords = 0;
      } else if (response.data != null && response.data.length != 0) {
        this.data = response.data;
        this.totalRecords = response.data[0];
      }
  
      this.totalRecords = response.totalRecords;
      
      this.loading = false;
    }

    OnChange() {
    if (this.isResetting) { return };

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);

  }

  paginate(event: any) {
    this.pageSize = event.rows
    this.first = event.first
    this.FillData(event.first)

  }
  showDialog(link: string) {
    this.link = link;
    this.visible = true;
  }

  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }


  async saveStatusChange() {
    if (!this.selectedTicket) return;

    try {
      const newStatus = {
        uuid: this.selectedTicket.uuid,
        status: this.selectedStatus.toString(),
        agentIDFK: this.agentIDFK
      };
      console.log('Updating status:', newStatus);

      const response = await this.ticketsService.Update(newStatus);

      if (response?.requestStatus?.toString() === '200') {
        this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
        this.selectedTicket.status = this.selectedStatus.toString();
        this.displayStatusDialog = false;
      } else {
        this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
      }

    } catch (error) {
      console.error('Error updating ticket status', error);
      this.layoutService.showError(this.messageService, 'toast', true, 'Failed to update status');
    }
  }

  openStatusDialog(ticket: any) {
    this.selectedTicket = ticket;
    this.selectedStatus = ticket.status?.toString() ?? '0';
    this.displayStatusDialog = true;
  }

  openAddTicket(row: TicketResponse | null = null) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      this.ticketsService.SelectedData = row;
      let content = this.ticketsService.SelectedData == null ? 'Create_Ticket' : 'Update_Ticket';
  
      this.translate.get(content).subscribe((res: string) => {
        content = res;
      });
  
      const component = this.layoutService.OpenDialog(AddTicketComponent, content);
      this.ticketsService.Dialog = component;
  
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.FillData();
      });
    }


      confirmDelete(row: TicketResponse) {
    
        console.log(row)
        this.confirmationService.confirm({
          message: this.translate.instant("Do_you_want_to_delete_this_record?"),
          header: this.translate.instant("Delete_Confirmation"),
          icon: 'pi pi-info-circle',
          key: 'positionDialog',
          closeOnEscape: true,
          accept: async () => {
            const response = (await this.ticketsService.Delete(row.uuid!)) as any;
    
            this.confirmationService.close();
    
            this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);
    
            this.FillData();
    
          },
          reject: () => {
            // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
          },
        });
      }

}
