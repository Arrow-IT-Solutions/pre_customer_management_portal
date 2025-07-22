import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { CustomerResponse, CustomerSearchRequest } from '../../customers/customers.module';
import { ServiceResponse, ServiceSearchRequest } from '../../services/services.module';
import { CustomersService } from 'src/app/layout/service/customers.service';
import { ServicesService } from 'src/app/Core/services/services.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
import { ProvisionedSession } from '../wizard-to-add.module';
import { SubscriptionRequest } from '../../subscription/subscription.module';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.scss'],
  providers: [MessageService]
})
export class DefinitionsComponent implements OnInit, OnDestroy {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  customers: CustomerResponse[] = [];
  services: ServiceResponse[] = [];
  statusList: ConstantResponse[] = [];
  session!: ProvisionedSession;
  private isNavigatingToEnvironment = false;
  isEditMode: boolean = false;
  editingServiceId: string | null = null;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public customerService: CustomersService,
    public serviceService: ServicesService,
    public provisionedService: ProvisionedService,
    public constantService: ConstantService,
    public translate: TranslateService
  ) {
    this.dataForm = formBuilder.group({
      customerName: ['', Validators.required],
      service: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      price: ['', Validators.required]

    });

  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async onSubmit() {
    console.log('onSubmit dataform : ', this.dataForm);

  }

  async ngOnInit() {
    try {
      this.loading = true;

      this.route.queryParams.subscribe(params => {
        if (params['mode'] === 'edit' && params['id']) {
          this.isEditMode = true;
          this.editingServiceId = params['id'];
        }
      });

      const response = await this.constantService.Search('SubscriptionStatus') as any;
      this.statusList = response?.data ?? [];

      await this.RetriveCustomer();
      await this.RetriveService();

      try {
        this.session = this.provisionedService.getSession();

        const fromBack = this.route.snapshot.queryParams['fromBack'];

        if (fromBack === 'true' || this.isEditMode) {
          this.restoreFormFromSession();
        } else {
          this.resetForm();
        }
      } catch (error) {
        console.log('No existing session found');
        this.resetForm();
      }

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  restoreFormFromSession() {
    if (this.session) {
      this.dataForm.patchValue({
        customerName: this.session.customerIDFK || '',
        service: this.session.serviceIDFK || '',
        startDate: this.session.subscription?.startDate ? new Date(this.session.subscription.startDate) : '',
        endDate: this.session.subscription?.endDate ? new Date(this.session.subscription.endDate) : '',
        status: this.session.subscription?.status ? Number(this.session.subscription.status) : '', // Convert to number to match dropdown options
        price: this.session.subscription?.price || ''
      });

      const statusValue = this.session.subscription?.status;
      let statusAsNumber: number | undefined;
      let matchingStatusOption: ConstantResponse | undefined;

      if (statusValue !== undefined && statusValue !== null && statusValue !== '') {
        statusAsNumber = Number(statusValue);
        matchingStatusOption = this.statusList.find(opt => opt.key === statusAsNumber);
      }

      // console.log(' Status matching check:', {
      //   sessionStatus: statusValue,
      //   sessionStatusType: typeof statusValue,
      //   convertedToNumber: statusAsNumber,
      //   matchingOption: matchingStatusOption,
      //   allStatusKeys: this.statusList.map(opt => opt.key),
      //   allStatusKeysTypes: this.statusList.map(opt => typeof opt.key)
      // });
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.dataForm.reset();
  }
  nextStep() {
    this.isNavigatingToEnvironment = true;

    if (this.dataForm.invalid) {
      this.submitted = true;

      // this.markFormGroupTouched(this.dataForm);
      this.layoutService.showError(this.messageService, 'toast', true, this.translate.instant("Customer_Service_required"));
      return;
    }

    var addSubscripe: SubscriptionRequest = {
      startDate: new Date(this.dataForm.value.startDate).toISOString(),
      endDate: new Date(this.dataForm.value.endDate).toISOString(),
      price: this.dataForm.controls['price'].value.toString(),
      customerServiceIDFK: 'af7ac44a-bbef-48be-8cde-bbcfe3b9a3ff',
      status: this.dataForm.controls['status'].value.toString(),

    };

    let existingEnvDatabases: any[] = [];
    try {
      const existingSession = this.provisionedService.getSession();
      if (existingSession.envDatabases && existingSession.envDatabases.length > 0) {
        existingEnvDatabases = existingSession.envDatabases;
      }
    } catch (error) {
      console.log('No existing environments found');
    }

    const session: ProvisionedSession = {
      customerIDFK: this.dataForm.controls['customerName'].value.toString(),
      serviceIDFK: this.dataForm.controls['service'].value.toString(),
      subscription: addSubscripe,
      envDatabases: existingEnvDatabases
    };

    this.provisionedService.setSession(session);
    this.router.navigate(['layout-admin/add/environment']);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  async RetriveCustomer() {

    var customerID: any;

    let filter: CustomerSearchRequest = {

      name: '',
      uuid: customerID,
      pageIndex: "",
      pageSize: '10'

    }
    const response = await this.customerService.Search(filter) as any

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

  async FillCustomer(event: any = null) {

    let filterInput = '';
    if (event != null) {
      filterInput = event.filter
    }

    let filter: CustomerSearchRequest = {

      name: filterInput,
      uuid: '',
      pageIndex: "",
      pageSize: '10'
    }
    const response = await this.customerService.Search(filter) as any

    this.customers = response.data
    await this.ReWriteCustomer();
  }


  async RetriveService() {

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

  async FillService(event: any = null) {

    let filterInput = '';
    if (event != null) {
      filterInput = event.filter
    }

    let filter: ServiceSearchRequest = {

      name: filterInput,
      uuid: '',
      pageIndex: "",
      pageSize: '10'
    }
    const response = await this.serviceService.Search(filter) as any

    this.services = response.data
    await this.ReWriteService();
  }

  ngOnDestroy() {
    if (!this.isNavigatingToEnvironment) {
      this.provisionedService.clearSession();
    }
  }

}
