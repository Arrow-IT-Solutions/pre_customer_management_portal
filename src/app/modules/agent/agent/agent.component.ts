import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { AgentResponse, AgentSearchRequest, AgentTranslationResponse } from '../agent.module';
import { AgentsService } from 'src/app/Core/services/agents.service';
import { PasswordComponent } from '../../password/password/password.component';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AgentComponent {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  dataForm!: FormGroup;
  loading = false;
  data: AgentResponse[] = [];
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  link = '';
  visible: boolean = false;
  companiesList: { label: string; value: string }[] = [];


  constructor(
    public formBuilder: FormBuilder,
    public agentService: AgentsService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    private companyService: CompaniesService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {
    this.dataForm = this.formBuilder.group({
      uuid: [''],
      name: [''],
      companyIDFK: ['']
    });

    this.agentService.refreshAgents$.subscribe(() => {
      this.FillData();
    });
  }

  async ngOnInit() {
    await this.retrieveCompanies();
    await this.FillData();

  }

  Search() {
    this.FillData();
  }

  retrieveCompanyLabel(row: AgentResponse): string {
    const companyUUID = row.companyIDFK?.trim();
    const match = this.companiesList.find(c => c.value === companyUUID);
    return match?.label || '-';
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

  }



  filterByCompany(companyUUID: string) {
    this.dataForm.get('companyIDFK')?.setValue(companyUUID);
    this.FillData();
  }





  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.totalRecords = 0;
    let filter: AgentSearchRequest = {
      name: this.dataForm.controls['name'].value,
      companyIDFK: this.dataForm.controls['companyIDFK'].value,
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),
    };
    const response = (await this.agentService.Search(filter)) as any;
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

  openAddAgent(row: AgentResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.agentService.SelectedData = row;
    let content = this.agentService.SelectedData == null ? 'Create_Agent' : 'Update_Agent';

    this.translate.get(content).subscribe((res: string) => {
      content = res;
    });

    const component = this.layoutService.OpenDialog(AddAgentComponent, content);
    this.agentService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }

  confirmDelete(row: AgentResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant("Do_you_want_to_delete_this_record?"),
      header: this.translate.instant("Delete_Confirmation"),
      icon: 'pi pi-info-circle',
      key: 'positionDialog',
      closeOnEscape: true,
      accept: async () => {
        const response = (await this.agentService.Delete(row.uuid!)) as any;

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
