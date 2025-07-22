import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  private isNavigatingWithinWizard = false;
  isEditMode: boolean = false;
  editingServiceId: string | null = null;
  private saveDataSubscription?: Subscription;
  private validateFormSubscription?: Subscription;
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

    this.dataForm.valueChanges.pipe(
      debounceTime(300) 
    ).subscribe(() => {
      if (!this.loading) { 
        this.updateSessionWithCurrentFormData();
      }
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

        await this.restoreFormFromSession();

      } catch (error) {
        console.log('No existing session found, creating new one');

        this.session = {};

        const savedFormData = sessionStorage.getItem('currentCustomerServiceFormData');
        if (savedFormData) {
          try {
            const parsedData = JSON.parse(savedFormData);
            this.session.currentCustomerServiceFormData = parsedData;
          } catch (parseError) {
            console.log('Failed to parse saved customer service data');
          }
        }

        const savedSessionData = sessionStorage.getItem('provisionedSessionData');
        if (savedSessionData) {
          try {
            const parsedSessionData = JSON.parse(savedSessionData);
            this.session = { ...this.session, ...parsedSessionData };
          } catch (parseError) {
            console.log('Failed to parse saved session data');
          }
        }

        this.provisionedService.setSession(this.session);

        await this.restoreFormFromSession();
      }

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }

    this.saveDataSubscription = this.provisionedService.saveCustomerServiceData$.subscribe(() => {
      this.handleSaveDataEvent();
    });

    this.validateFormSubscription = this.provisionedService.validateCustomerServiceForm$.subscribe((data) => {
      this.handleFormValidationEvent(data);
    });
  }

  private handleSaveDataEvent() {
    try {
      this.updateSessionWithCurrentFormData();
    } catch (error) {
      console.log('Customer Service: Error saving form data:', error);
    }
  }

  private handleFormValidationEvent(data: {resolve: (value: boolean) => void}) {
    
    const isValid = this.validateForm();
    
    data.resolve(isValid);
  }

  private validateForm(): boolean {
    if (this.dataForm.invalid) {
      this.submitted = true;
      this.markFormGroupTouched(this.dataForm);
      
      this.layoutService.showError(
        this.messageService, 
        'toast', 
        true, 
        this.translate.instant("Customer_Service_required")
      );
      
      return false;
    }
    
    return true;
  }

  private getFormErrors(): any {
    let errors: any = {};
    Object.keys(this.dataForm.controls).forEach(key => {
      const control = this.dataForm.get(key);
      if (control && !control.valid && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private updateSessionWithCurrentFormData() {
    if (this.loading || !this.dataForm) {
      console.log('Customer Service: Skipping save - form not ready or loading');
      return;
    }

    try {
      this.session = this.provisionedService.getSession();
    } catch (error) {
      console.log('Customer Service: Creating new session for customer service data');
      this.session = {};
      try {
        const savedData = sessionStorage.getItem('currentCustomerServiceFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          this.session.currentCustomerServiceFormData = parsedData;
        }
      } catch (parseError) {
        console.log('Customer Service: No saved customer service form data to restore');
      }
    }

    const currentFormData = {
      customerName: this.dataForm.controls['customerName'].value || '',
      service: this.dataForm.controls['service'].value || '',
      startDate: this.dataForm.controls['startDate'].value || '',
      endDate: this.dataForm.controls['endDate'].value || '',
      status: this.dataForm.controls['status'].value !== null && this.dataForm.controls['status'].value !== undefined ? this.dataForm.controls['status'].value : '', 
      price: this.dataForm.controls['price'].value || ''
    };

    this.session.currentCustomerServiceFormData = currentFormData;

    this.provisionedService.setSession(this.session);
    sessionStorage.setItem('currentCustomerServiceFormData', JSON.stringify(currentFormData));

    const sessionDataToSave = {
      customerIDFK: this.session.customerIDFK,
      serviceIDFK: this.session.serviceIDFK,
      subscription: this.session.subscription,
      envDatabases: this.session.envDatabases,
      currentCustomerServiceFormData: currentFormData
    };
    sessionStorage.setItem('provisionedSessionData', JSON.stringify(sessionDataToSave));

  }

  private async restoreFormFromSessionData() {
    if (this.session?.currentCustomerServiceFormData) {
      const formData = this.session.currentCustomerServiceFormData;
      this.loading = true;

      if (this.customers.length === 0) {
        await this.RetriveCustomer();
      }
      if (this.services.length === 0) {
        await this.RetriveService();
      }

      let statusToRestore: any = '';
      if (formData.status !== undefined && formData.status !== null) {
        const statusAsNumber = Number(formData.status);
        if (!isNaN(statusAsNumber)) {
          statusToRestore = statusAsNumber;
        } else if (formData.status !== '') {
          statusToRestore = formData.status;
        }
      }

      this.dataForm.patchValue({
        customerName: formData.customerName || '',
        service: formData.service || '',
        startDate: formData.startDate ? new Date(formData.startDate) : '',
        endDate: formData.endDate ? new Date(formData.endDate) : '',
        status: statusToRestore,
        price: formData.price || ''
      });

      setTimeout(() => {
        this.loading = false;
      }, 100);

    }
  }

  private clearSavedFormData() {
    try {
      if (this.session) {
        delete this.session.currentCustomerServiceFormData;
        this.provisionedService.setSession(this.session);
      }
      sessionStorage.removeItem('currentCustomerServiceFormData');
    } catch (error) {
      console.log('No session to clear form data from');
    }
  }

  async restoreFormFromSession() {
    if (this.session) {
      if (this.session.currentCustomerServiceFormData) {
        await this.restoreFormFromSessionData();
      } else {
        if (this.customers.length === 0) {
          await this.RetriveCustomer();
        }
        if (this.services.length === 0) {
          await this.RetriveService();
        }

        const statusValue = this.session.subscription?.status;
        let statusToSet: any = '';
        
        if (statusValue !== undefined && statusValue !== null) {
          const statusAsNumber = Number(statusValue);
          if (!isNaN(statusAsNumber)) {
            statusToSet = statusAsNumber;
          } else if (statusValue !== '') {
            statusToSet = statusValue;
          }
        }

        this.dataForm.patchValue({
          customerName: this.session.customerIDFK || '',
          service: this.session.serviceIDFK || '',
          startDate: this.session.subscription?.startDate ? new Date(this.session.subscription.startDate) : '',
          endDate: this.session.subscription?.endDate ? new Date(this.session.subscription.endDate) : '',
          status: statusToSet,
          price: this.session.subscription?.price || ''
        });
      }
    } else {
      this.resetForm();
    }
  }

  async resetForm() {
    this.loading = true;

    if (this.session?.currentCustomerServiceFormData) {
      await this.restoreFormFromSessionData();
    } else {
      this.dataForm.reset();
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
  }
  nextStep() {
    this.isNavigatingToEnvironment = true;
    this.isNavigatingWithinWizard = true;

    this.updateSessionWithCurrentFormData();

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

    const currentFormData = {
      customerName: this.dataForm.controls['customerName'].value || '',
      service: this.dataForm.controls['service'].value || '',
      startDate: this.dataForm.controls['startDate'].value || '',
      endDate: this.dataForm.controls['endDate'].value || '',
      status: this.dataForm.controls['status'].value !== null && this.dataForm.controls['status'].value !== undefined ? this.dataForm.controls['status'].value : '',
      price: this.dataForm.controls['price'].value || ''
    };

    const updatedSession = this.provisionedService.getSession();
    updatedSession.currentCustomerServiceFormData = currentFormData;
    this.provisionedService.setSession(updatedSession);

    sessionStorage.setItem('currentCustomerServiceFormData', JSON.stringify(currentFormData));

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
    const currentUrl = this.router.url;
    const isStillInWizard = currentUrl.includes('/layout-admin/add/');
    
    if (!isStillInWizard && !this.isNavigatingWithinWizard) {
      this.clearAllSavedData();
    }

    if (this.saveDataSubscription) {
      this.saveDataSubscription.unsubscribe();
    }
    if (this.validateFormSubscription) {
      this.validateFormSubscription.unsubscribe();
    }
  }

  clearAllSavedData() {
    this.provisionedService.clearSession();
    sessionStorage.removeItem('currentEnvironmentFormData');
    sessionStorage.removeItem('currentCustomerServiceFormData');
    sessionStorage.removeItem('provisionedSessionData');
    sessionStorage.removeItem('editingProvisionedServiceId');
  }

}
