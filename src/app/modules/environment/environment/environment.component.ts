import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  EnvironmentSearchRequest,
  EnvironmentResponse,
  EnvironmentTranslationResponse
} from '../environment.module';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddEnvironmentComponent } from '../add-environment/add-environment.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EnvironmentService } from 'src/app/Core/services/environments.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ProvisionedServiceSearchRequest } from '../../wizard-to-add/wizard-to-add.module';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { CompanyServiceService } from 'src/app/layout/service/companyService.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class EnvironmentComponent {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  visible: boolean = false;
  link = '';

  dataForm!: FormGroup;
  data: EnvironmentResponse[] = [];
servers: { [key: string]: string } = {};
companyServices: { [key: string]: string } = {};


  loading = false;
  isResetting: boolean = false;

  doneTypingInterval = 1000;
  typingTimer: any;

  constructor(
    public formBuilder: FormBuilder,
    public environmentService: EnvironmentService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    private serverService: ServersService,
    public provisionedService: ProvisionedService,
    public companyService: CompanyServiceService,
    public confirmationService: ConfirmationService
  ) {
    this.dataForm = this.formBuilder.group({
      name: [''],
      uuid: [''],
      url: [''],
      serverIDFK: [''],

    });
  }

  async ngOnInit() {
    await this.retrieveServer();
    await this.retrieveCompanyService();
    await this.FillData();
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];

    const filter: EnvironmentSearchRequest = {
      name: this.dataForm.get('name')?.value?.trim(),
      uuid: this.dataForm.get('uuid')?.value?.trim(),
      companyServiceIDFK: '',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    const response = await this.environmentService.Search(filter) as any;
console.log('Environment API Response:', response);

    this.data = response?.data || [];
    this.totalRecords = Number(response?.totalRecords || 0);
    this.loading = false;
  }

retrieveServers(row: EnvironmentResponse): string {
  const serverUUID = row.serverIDFK;
  return this.servers[serverUUID?.trim()] || '-';
}


retrieveCompanyServiceLabel(env: EnvironmentResponse): string {
  const companyServiceUUID = env.companyServiceIDFK?.trim();
  return this.companyServices[companyServiceUUID] || '-';
}



 async retrieveCompanyService() {
  const filter = {
    uuid: '',
    companyIDFK: '',
    ServiceIDFK: '',
    includeCompany: '1',
    includeService: '1',
    pageIndex: '0',
    pageSize: '10'
  };

  const response = await this.provisionedService.Search(filter) as any;
  const companyService = response?.data || [];

  this.companyServices = {};

  const lang = this.layoutService.config.lang || 'en';

  companyService.forEach((cs: any) => {
    if (cs.uuid) {
      const companyName = cs.company?.companyTranslation?.[lang]?.name || 'Unknown Company';
      const serviceName = cs.service?.serviceTranslation?.[lang]?.name || 'Unknown Service';
      this.companyServices[cs.uuid.trim()] = `${companyName} - ${serviceName}`;
    }
  });

  console.log('Company Services Map:', this.companyServices);
}



  async retrieveServer() {
  const filter = {
    name: '',
    uuid: '',
    pageIndex: '0',
    pageSize: '10'
  };

  const response = await this.serverService.Search(filter) as any;
  const servers = response?.data || [];

this.servers = {};
servers.forEach((server: any) => {
  if (server.uuid) {
    this.servers[server.uuid.trim()] = server.hostname || '—';
  }
});

console.log('Server Map:', this.servers);


}


  openAddEnvironment(row: EnvironmentResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';

    this.environmentService.SelectedData = row;
    let content = this.environmentService.SelectedData == null ? 'Create_Environment' : 'Update_Environment';

    this.translate.get(content).subscribe(res => content = res);

    const component = this.layoutService.OpenDialog(AddEnvironmentComponent, content);
    this.environmentService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }

  async confirmDelete(row: EnvironmentResponse) {
      this.confirmationService.confirm({
        message: this.translate.instant('Do_you_want_to_delete_this_record?'),
        header: this.translate.instant('Delete_Confirmation'),
        icon: 'pi pi-info-circle',
        acceptLabel: this.translate.instant('Yes'),
        rejectLabel: this.translate.instant('No'),
        key: 'confirmDialog',
        accept: async () => {
          try {
            const resp = await this.environmentService.Delete(row.uuid!) as any;
            this.layoutService.showSuccess(this.messageService, 'toast', true, resp?.requestMessage || 'Deleted');
            this.FillData();
          } catch (error) {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('Error'),
              detail: this.translate.instant('database.Failed_to_delete')
            });
          }
        }
      });
    }

  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }


  OnChange() {
    if (this.isResetting) return;

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
}
