import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EnvironmentRequest, EnvironmentUpdateRequest } from '../environment.module';
import { EnvironmentService } from 'src/app/Core/services/environments.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ServerResponse } from '../../servers/servers.module';
import { CompanyServiceResponse, ProvisionedServiceSearchRequest } from '../../wizard-to-add/wizard-to-add.module';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { CompanyServiceService } from 'src/app/layout/service/companyService.service';

@Component({
  selector: 'app-add-environment',
  templateUrl: './add-environment.component.html',
  styleUrls: ['./add-environment.component.scss'],
  providers: [MessageService]
})
export class AddEnvironmentComponent {
  dataForm!: FormGroup;
  submitted = false;
  btnLoading = false;
  loading = false;
  servers: any[] = [];
  companyServices: CompanyServiceResponse[] = [];
  companyServiceOptions: { label: string; value: string }[] = [];
  companyServiceList: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private environmentService: EnvironmentService,
    private serverService: ServersService,
    public companyService: CompanyServiceService,
    public provisionedService: ProvisionedService,
    private messageService: MessageService
  ) {
    this.dataForm = this.formBuilder.group({
      companyServiceIDFK: ['' , Validators.required],
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      serverIDFK: ['', Validators.required]
    });
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    this.loading = true;
    await this.RetrieveCompanyServices();
    await this.retrieveServers();
    this.resetForm();

    if (this.environmentService.SelectedData) {
      await this.fillData();
    }
    this.loading = false;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      return;
    }

    this.btnLoading = true;

    try {
      await this.save();
    } finally {
      this.btnLoading = false;
    }
  }


async save() {

    let response;

    var environmentTranslations = [
      {
        name: this.dataForm.controls['nameAr'].value == null ? '' : this.dataForm.controls['nameAr'].value.toString(),
        language: 'ar'
      },
      {
        name: this.dataForm.controls['nameEn'].value == null ? '' : this.dataForm.controls['nameEn'].value.toString(),
        language: 'en'
      }
    ];


    if (this.environmentService.SelectedData != null) {
      // update
      var updateCustomer: EnvironmentUpdateRequest = {
        uuid: this.environmentService.SelectedData?.uuid?.toString(),
        environmentTranslation: environmentTranslations,
        url: this.dataForm.controls['url'].value == null ? null : this.dataForm.controls['url'].value.toString(),
        companyServiceIDFK: this.dataForm.controls['companyServiceIDFK'].value,
        serverIDFK: this.dataForm.controls['serverIDFK'].value

      };
      console.log(updateCustomer)
      response = await this.environmentService.Update(updateCustomer);
    } else {
      // add
      var addCustomer: EnvironmentRequest = {
        environmentTranslation: environmentTranslations,
        url: this.dataForm.controls['url'].value == null ? null : this.dataForm.controls['url'].value.toString(),
        companyServiceIDFK: this.dataForm.controls['companyServiceIDFK'].value,
        serverIDFK: this.dataForm.controls['serverIDFK'].value
      };

      console.log('addCustomer ', addCustomer)

      response = await this.environmentService.Add(addCustomer);
    }

    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (this.environmentService.SelectedData == null) {
        this.resetForm();
        setTimeout(() => {
          this.environmentService.Dialog.adHostChild.viewContainerRef.clear();
          this.environmentService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.environmentService.triggerRefreshEnvironment();
        }, 600);
      } else {
        setTimeout(() => {
          this.environmentService.Dialog.adHostChild.viewContainerRef.clear();
          this.environmentService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.environmentService.triggerRefreshEnvironment();
        }, 600);
      }
    } else {
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
    }

    this.btnLoading = false;
    this.submitted = false;
  }
  resetForm() {
    this.dataForm.reset();
    this.submitted = false;
  }

  async fillData() {
    if (!this.environmentService.SelectedData) return;

    const environment = this.environmentService.SelectedData;
    const ar = environment.environmentTranslation?.['ar'];
    const en = environment.environmentTranslation?.['en'];

    this.dataForm.patchValue({
      companyServiceIDFK: this.environmentService.SelectedData?.companyServiceIDFK ?? '',
      nameAr: ar?.name || '',
      nameEn: en?.name || '',
      url: environment.url || '',
      serverIDFK: this.environmentService.SelectedData?.serverIDFK ?? '',

    });
  }
async retrieveServers() {
  const filter = {
    name: '',
    uuid: '',
    pageIndex: '0',
    pageSize: '10'
  };

  const response = await this.serverService.Search(filter) as any;
  const lang = this.layoutService.config.lang || 'en';

  this.servers = (response.data || []).map((server: ServerResponse) => {
    return {
      label: server.hostname || server.ipAddress || '—',
      value: server.uuid
    };
  });
}


  async RetrieveCompanyServices() {
     let filter: ProvisionedServiceSearchRequest = {
          uuid: '',
          companyIDFK: '',
          serviceIDFK: '',
          includeCompany: '1',
          includeService: '1',
          pageIndex: '0',
          pageSize: '10',

        };

        const rawResponse = (await this.provisionedService.Search(filter)) as any;

    console.log('Raw response:', rawResponse);

  this.companyServiceList = rawResponse.data;

  const lang = this.layoutService.config.lang || 'en';


  this.companyServiceOptions = (rawResponse.data ?? []).map((item: any) => ({
    label: `${item.company?.companyTranslation?.[lang]?.name ?? 'Unknown Company'} - ${item.service?.serviceTranslation?.[lang]?.name ?? 'Unknown Service'}`,
    value: item.uuid
  }));




    console.log('Company Services Dropdown:', this.companyServiceOptions);
}






  //   async filterCustomerServices(event: any) {
  // const filterInput = event?.filter || '';
  // const filter: CustomerSearchRequest = {
  //   name: filterInput,
  //   uuid: '',
  //   pageIndex: '',
  //   pageSize: '10'
  // };

  // const response = await this.customerService.Search(filter) as any;
  // const lang = this.layoutService.config.lang || 'en';

  // this.customerServices = (response.data ?? []).map((item: any) => {
  //   const customerName = item.customerTranslation?.[lang]?.name || '—';
  //   const serviceName = item.service?.serviceTranslation?.[lang]?.name || '—';

  //   return {
  //     ...item,
  //     name: `${customerName} - ${serviceName}`
  //   };
  // });
// }



  }







