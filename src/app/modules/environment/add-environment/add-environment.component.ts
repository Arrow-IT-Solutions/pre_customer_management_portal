import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EnvironmentRequest, EnvironmentUpdateRequest } from '../environment.module';
import { EnvironmentService } from 'src/app/Core/services/environments.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ServerResponse } from '../../servers/servers.module';

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
  customerServices: any[] = [];
  servers: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private environmentService: EnvironmentService,
    private serverService: ServersService,
    private messageService: MessageService
  ) {
    this.dataForm = this.formBuilder.group({
      customerServiceIDFK: [''],
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
    await this.retrieveCustomerServices();
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
        customerServiceIDFK: 'af7ac44a-bbef-48be-8cde-bbcfe3b9a3ff',
        serverIDFK: this.dataForm.controls['serverIDFK'].value

      };
      console.log(updateCustomer)
      response = await this.environmentService.Update(updateCustomer);
    } else {
      // add
      var addCustomer: EnvironmentRequest = {
        environmentTranslation: environmentTranslations,
        url: this.dataForm.controls['url'].value == null ? null : this.dataForm.controls['url'].value.toString(),
        customerServiceIDFK: 'af7ac44a-bbef-48be-8cde-bbcfe3b9a3ff',
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
      customerServiceIDFK: this.environmentService.SelectedData?.customerServiceIDFK ?? '',
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


  async retrieveCustomerServices() {
  const filter = {
    name: '',
    uuid: '',
    pageIndex: '0',
    pageSize: '10',
    IncludeCustomer: '1',   
    IncludeService: '1'     
  };

  const response = await this.environmentService.Search(filter) as any;
  console.log('Search response:', response);
  const lang = this.layoutService.config.lang || 'en';

 this.customerServices = (response.data || []).map((service: any) => {
  const environmentTranslation = service.customer?.environmentTranslation?.[lang]?.name;
  const serviceTranslation = service.service?.serviceTranslation?.[lang]?.name;

  return {
    label: environmentTranslation || serviceTranslation || '—',
    value: service.uuid
  };
});

}

  }

