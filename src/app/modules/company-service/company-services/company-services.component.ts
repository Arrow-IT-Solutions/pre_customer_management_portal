import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { Router } from '@angular/router';
import { EnvDatabase, ProvisionedServiceResponse, ProvisionedServiceSearchRequest, ProvisionedSession } from '../../wizard-to-add/wizard-to-add.module';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { SubscriptionRequest } from '../../subscription/subscription.module';
import { ServerResponse } from '../../servers/servers.module';
import { ServiceResponse, ServiceSearchRequest } from '../../services/services.module';
import { ServicesService } from 'src/app/Core/services/services.service';
import { EncryptionService } from 'src/app/shared/service/encryption.service';
import { CompanyResponse, CompanySearchRequest } from '../../companies/companies.module';
import { CompanyServiceService } from 'src/app/layout/service/companyService.service';
import { CompaniesService } from 'src/app/layout/service/companies.service';

@Component({
  selector: 'app-company-services',
  templateUrl: './company-services.component.html',
  styleUrls: ['./company-services.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CompanyServicesComponent {
  dataForm!: FormGroup;
  loading = false;
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  data: ProvisionedServiceResponse[] = [];
  statusList: ConstantResponse[] = [];
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  companyServiceTotal: number = 0;
  companies: CompanyResponse[] = [];
  services: ServiceResponse[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public translate: TranslateService,
    public constantService: ConstantService,
    public companyService: CompanyServiceService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public provisionedService: ProvisionedService,
    public companiesService: CompaniesService,
    public serviceService: ServicesService,
    public route: Router
  ) {
    this.dataForm = this.formBuilder.group({
      companyName: [''],
      service: ['']
    });

  }

  async ngOnInit() {
    await this.FillData();
    await this.FillCompanies();
    await this.FillServices();
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.companyServiceTotal = 0;
    let filter: ProvisionedServiceSearchRequest = {
      uuid: '',
      companyIDFK: this.dataForm.controls['companyName'].value,
      serviceIDFK: this.dataForm.controls['service'].value,
      includeCompany: '1',
      includeService: '1',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),

    };

    const response = (await this.provisionedService.Search(filter)) as any;

    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.companyServiceTotal = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.companyServiceTotal = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;

  }

  Search() {
    this.FillData();
  }

  OnChange() {
    if (this.isResetting) return;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);
  }

  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }

  async paginate(event: any) {
    this.pageSize = event.rows;
    this.first = event.first;
    const pageIndex = event.first / event.rows;
    await this.FillData(pageIndex);
  }


  openAddService() {
    this.route.navigate(['layout-admin/add/company-service'])
  }

  async OpenAddCompanyService(
    row: ProvisionedServiceResponse | null = null
  ): Promise<void> {
    if (!row) {
      await this.route.navigate(['layout-admin/add/company-service']);
      return;
    }

    const envDatabases: EnvDatabase[] = await Promise.all(
      row.environments.map(async env => {
        const dbRec = row.databases.find(db => db.environment?.uuid === env.uuid);

        const connectionString = dbRec?.connectionString
          ? await EncryptionService.decrypt(dbRec.connectionString)
          : '';
        const dbPassword = dbRec?.password
          ? await EncryptionService.decrypt(dbRec.password)
          : '';

        return {
          url: env.url || '',
          serverIDFK: env.serverIDFK || '',
          server: (env as any).server || null,
          environmentTranslation: Object.values(env.environmentTranslation || {}).map((et: any) => ({
            uuid: et.uuid || '',
            name: et.name || '',
            language: et.language || ''
          })),
          dbName: dbRec?.name || '',
          connectionString,
          dbUserName: dbRec?.userName || '',
          dbPassword
        } as EnvDatabase;
      })
    );
    const editSession: ProvisionedSession = {
      companyIDFK: row.company.uuid,
      serviceIDFK: row.service.uuid,
      subscription: {
        uuid: row.subscription.uuid || row.uuid,
        startDate: row.subscription.startDate.toString(),
        endDate: row.subscription.endDate.toString(),
        price: row.subscription.price.toString(),
        status: row.subscription.status.toString(),
        companyServiceIDFK: row.uuid
      } as SubscriptionRequest,
      envDatabases
    };
    sessionStorage.setItem('editingProvisionedServiceId', row.uuid);
    this.provisionedService.setSession(editSession);
    await this.route.navigate(
      ['layout-admin/add/company-service'],
      { queryParams: { mode: 'edit', id: row.uuid } }
    );
  }



  async confirmDelete(row: ProvisionedServiceResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.provisionedService.Delete(row.uuid!) as any;
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

  async FillCompanies(event: any = null) {

    var companyID: any;

    let filter: CompanySearchRequest = {

      name: '',
      uuid: companyID,
      pageIndex: "",
      pageSize: '10'

    }
    const response = await this.companiesService.Search(filter) as any

    this.companies = response.data,

      await this.ReWriteCompany();
  }

  ReWriteCompany(): any {

    var companyDTO: any[] = []

    this.companies.map(company => {
      const translation = company.companyTranslation?.[this.layoutService.config.lang] as any;
      const companyName = translation?.name;

      var obj =
      {
        ...company,
        name: `${companyName}`.trim()

      }

      companyDTO.push(obj)

    })

    this.companies = companyDTO;

  }

  async FillServices(event: any = null) {

    var serviceID: any;

    let filter: ServiceSearchRequest = {

      name: '',
      uuid: serviceID,
      pageIndex: "",
      pageSize: '10'

    }
    const response = await this.serviceService.Search(filter) as any

    this.services = response.data,

      await this.ReWriteService();
  }

  ReWriteService(): any {

    var serviceDTO: any[] = []

    this.services.map(service => {
      const translation = service.serviceTranslation?.[this.layoutService.config.lang] as any;
      const serviceName = translation?.name;

      var obj =
      {
        ...service,
        name: `${serviceName}`.trim()

      }

      serviceDTO.push(obj)

    })

    this.services = serviceDTO;

  }
  viewDetails(){
    this.route.navigate(['layout-admin/company-services/services-details'])
  }

}
