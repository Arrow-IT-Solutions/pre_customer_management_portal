import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { customerServiceResponse } from '../customer-service.module';
import { customerServiceService } from 'src/app/layout/service/customerService.service';
import { Router } from '@angular/router';
import { EnvDatabase, ProvisionedServiceResponse, ProvisionedServiceSearchRequest, ProvisionedSession } from '../../wizard-to-add/wizard-to-add.module';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { SubscriptionRequest } from '../../subscription/subscription.module';
import { CustomerResponse, CustomerSearchRequest } from '../../customers/customers.module';
import { ServerResponse } from '../../servers/servers.module';
import { CustomersService } from 'src/app/layout/service/customers.service';
import { ServiceResponse, ServiceSearchRequest } from '../../services/services.module';
import { ServicesService } from 'src/app/Core/services/services.service';
import { EncryptionService } from 'src/app/shared/service/encryption.service';

@Component({
  selector: 'app-customer-services',
  templateUrl: './customer-services.component.html',
  styleUrls: ['./customer-services.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CustomerServicesComponent {
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
  customerServiceTotal: number = 0;
  customers: CustomerResponse[] = [];
  services: ServiceResponse[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public translate: TranslateService,
    public constantService: ConstantService,
    public customerService: customerServiceService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public provisionedService: ProvisionedService,
    public customersService: CustomersService,
    public serviceService: ServicesService,
    public route: Router
  ) {
    this.dataForm = this.formBuilder.group({
      customerName: [''],
      service: ['']
    });

  }

  async ngOnInit() {
    await this.FillData();
    await this.FillCustomers();
    await this.FillServices();
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.customerServiceTotal = 0;
    let filter: ProvisionedServiceSearchRequest = {
      uuid: '',
      CustomerIDFK: this.dataForm.controls['customerName'].value,
      ServiceIDFK: this.dataForm.controls['service'].value,
      IncludeCustomer: '1',
      IncludeService: '1',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),

    };

    const response = (await this.provisionedService.Search(filter)) as any;

    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.customerServiceTotal = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.customerServiceTotal = response.data[0];
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
    this.route.navigate(['layout-admin/add/customer-service'])
  }

  async OpenAddCustomerService(
    row: ProvisionedServiceResponse | null = null
  ): Promise<void> {
    if (!row) {
      await this.route.navigate(['layout-admin/add/customer-service']);
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
      customerIDFK: row.customer.uuid,
      serviceIDFK: row.service.uuid,
      subscription: {
        uuid: row.subscription.uuid || row.uuid,
        startDate: row.subscription.startDate.toString(),
        endDate: row.subscription.endDate.toString(),
        price: row.subscription.price.toString(),
        status: row.subscription.status.toString(),
        customerServiceIDFK: row.uuid
      } as SubscriptionRequest,
      envDatabases
    };
    sessionStorage.setItem('editingProvisionedServiceId', row.uuid);
    this.provisionedService.setSession(editSession);
    await this.route.navigate(
      ['layout-admin/add/customer-service'],
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

  async FillCustomers(event: any = null) {

    var customerID: any;

    let filter: CustomerSearchRequest = {

      name: '',
      uuid: customerID,
      pageIndex: "",
      pageSize: '10'

    }
    const response = await this.customersService.Search(filter) as any

    this.customers = response.data,

      await this.ReWriteCustomer();
  }

  ReWriteCustomer(): any {

    var customerDTO: any[] = []

    this.customers.map(customer => {
      const translation = customer.customerTranslation?.[this.layoutService.config.lang] as any;
      const customerName = translation?.name;

      var obj =
      {
        ...customer,
        name: `${customerName}`.trim()

      }

      customerDTO.push(obj)

    })

    this.customers = customerDTO;

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

}
