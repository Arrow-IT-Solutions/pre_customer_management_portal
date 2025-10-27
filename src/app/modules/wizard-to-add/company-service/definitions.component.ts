import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServiceResponse, ServiceSearchRequest } from '../../services/services.module';
import { ServicesService } from 'src/app/Core/services/services.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
import { ProvisionedSession } from '../wizard-to-add.module';
import { SubscriptionRequest } from '../../subscription/subscription.module';
import { TranslateService } from '@ngx-translate/core';
import { CompanyResponse, CompanySearchRequest } from '../../companies/companies.module';
import { CompaniesService } from 'src/app/layout/service/companies.service';

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
  companies: CompanyResponse[] = [];
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
    public companyService: CompaniesService,
    public serviceService: ServicesService,
    public provisionedService: ProvisionedService,
    public constantService: ConstantService,
    public translate: TranslateService
  ) {
    this.dataForm = formBuilder.group({
      companyName: ['', Validators.required],
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

      await this.RetriveCompanies();
      await this.RetriveService();

      try {
        this.session = this.provisionedService.getSession();

        const fromBack = this.route.snapshot.queryParams['fromBack'];

        await this.restoreFormFromSession();

      } catch (error) {

        this.session = {};

        const savedFormData = sessionStorage.getItem('currentCompanyServiceFormData');
        if (savedFormData) {
          try {
            const parsedData = JSON.parse(savedFormData);
            this.session.currentCompanyServiceFormData = parsedData;
          } catch (parseError) {
          }
        }

        const savedSessionData = sessionStorage.getItem('provisionedSessionData');
        if (savedSessionData) {
          try {
            const parsedSessionData = JSON.parse(savedSessionData);
            this.session = { ...this.session, ...parsedSessionData };
          } catch (parseError) {
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

    this.saveDataSubscription = this.provisionedService.saveCompanyServiceData$.subscribe(() => {
      this.handleSaveDataEvent();
    });

    this.validateFormSubscription = this.provisionedService.validateCompanyServiceForm$.subscribe((data) => {
      this.handleFormValidationEvent(data);
    });
  }

  private handleSaveDataEvent() {
    try {
      this.updateSessionWithCurrentFormData();
    } catch (error) {
    }
  }

  private handleFormValidationEvent(data: { resolve: (value: boolean) => void }) {

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
        this.translate.instant("Company_Service_required")
      );

      return false;
    }

    return true;
  }


  private updateSessionWithCurrentFormData() {
    if (this.loading || !this.dataForm) {
      return;
    }

    try {
      this.session = this.provisionedService.getSession();
    } catch (error) {
      this.session = {};
      try {
        const savedData = sessionStorage.getItem('currentCompanyServiceFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          this.session.currentCompanyServiceFormData = parsedData;
        }
      } catch (parseError) {
      }
    }

    const currentFormData = {
      companyName: this.dataForm.controls['companyName'].value || '',
      service: this.dataForm.controls['service'].value || '',
      startDate: this.dataForm.controls['startDate'].value || '',
      endDate: this.dataForm.controls['endDate'].value || '',
      status: this.dataForm.controls['status'].value !== null && this.dataForm.controls['status'].value !== undefined ? this.dataForm.controls['status'].value : '',
      price: this.dataForm.controls['price'].value || ''
    };

    this.session.currentCompanyServiceFormData = currentFormData;

    this.provisionedService.setSession(this.session);
    sessionStorage.setItem('currentCompanyServiceFormData', JSON.stringify(currentFormData));

    const sessionDataToSave = {
      companyIDFK: this.session.companyIDFK,
      serviceIDFK: this.session.serviceIDFK,
      subscription: this.session.subscription,
      envDatabases: this.session.envDatabases,
      currentCompanyServiceFormData: currentFormData
    };
    sessionStorage.setItem('provisionedSessionData', JSON.stringify(sessionDataToSave));

  }

  private async restoreFormFromSessionData() {
    if (this.session?.currentCompanyServiceFormData) {
      const formData = this.session.currentCompanyServiceFormData;
      this.loading = true;

      if (this.companies.length === 0) {
        await this.RetriveCompanies();
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
        companyName: formData.companyName || '',
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


  async restoreFormFromSession() {
    if (this.session) {
      if (this.session.currentCompanyServiceFormData) {
        await this.restoreFormFromSessionData();
      } else {
        if (this.companies.length === 0) {
          await this.RetriveCompanies();
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
          companyName: this.session.companyIDFK || '',
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

    if (this.session?.currentCompanyServiceFormData) {
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
      this.layoutService.showError(this.messageService, 'toast', true, this.translate.instant("Company_Service_required"));
      return;
    }

    var addSubscripe: SubscriptionRequest = {
      startDate: new Date(this.dataForm.value.startDate).toISOString(),
      endDate: new Date(this.dataForm.value.endDate).toISOString(),
      price: this.dataForm.controls['price'].value.toString(),
      companyServiceIDFK: 'af7ac44a-bbef-48be-8cde-bbcfe3b9a3ff',
      status: this.dataForm.controls['status'].value.toString(),

    };

    let existingEnvDatabases: any[] = [];
    try {
      const existingSession = this.provisionedService.getSession();
      if (existingSession.envDatabases && existingSession.envDatabases.length > 0) {
        existingEnvDatabases = existingSession.envDatabases;
      }
    } catch (error) {

    }

    const session: ProvisionedSession = {
      companyIDFK: this.dataForm.controls['companyName'].value.toString(),
      serviceIDFK: this.dataForm.controls['service'].value.toString(),
      subscription: addSubscripe,
      envDatabases: existingEnvDatabases
    };

    this.provisionedService.setSession(session);

    const currentFormData = {
      companyName: this.dataForm.controls['companyName'].value || '',
      service: this.dataForm.controls['service'].value || '',
      startDate: this.dataForm.controls['startDate'].value || '',
      endDate: this.dataForm.controls['endDate'].value || '',
      status: this.dataForm.controls['status'].value !== null && this.dataForm.controls['status'].value !== undefined ? this.dataForm.controls['status'].value : '',
      price: this.dataForm.controls['price'].value || ''
    };

    const updatedSession = this.provisionedService.getSession();
    updatedSession.currentCompanyServiceFormData = currentFormData;
    this.provisionedService.setSession(updatedSession);

    sessionStorage.setItem('currentCompanyServiceFormData', JSON.stringify(currentFormData));

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

  async RetriveCompanies() {

    var companyID: any;

    let filter: CompanySearchRequest = {

      name: '',
      uuid: companyID,
      pageIndex: "",
      pageSize: '10'

    }
    const response = await this.companyService.Search(filter) as any

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

  async FillCompany(event: any = null) {

    let filterInput = '';
    if (event != null) {
      filterInput = event.filter
    }

    let filter: CompanySearchRequest = {

      name: filterInput,
      uuid: '',
      pageIndex: "",
      pageSize: '10'
    }
    const response = await this.companyService.Search(filter) as any

    this.companies = response.data
    await this.ReWriteCompany();
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
    sessionStorage.removeItem('currentCompanyServiceFormData');
    sessionStorage.removeItem('provisionedSessionData');
    sessionStorage.removeItem('editingProvisionedServiceId');
  }

}
