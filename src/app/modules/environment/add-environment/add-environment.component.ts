import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EnvironmentRequest, EnvironmentUpdateRequest } from '../environment.module';
import { EnvironmentService } from 'src/app/Core/services/environments.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private layoutService: LayoutService,
    private environmentService: EnvironmentService,
    private messageService: MessageService
  ) {
    this.dataForm = this.formBuilder.group({
      customerServiceIDFK: ['', Validators.required],
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]]
    });
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    this.loading = true;
    await this.retrieveCustomerServices();
    this.resetForm();

    if (this.environmentService.SelectedData) {
      await this.fillData();
    }
    this.loading = false;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please correct the errors in the form.');
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
    const environmentTranslations = [
  {
    name: this.form['nameAr'].value || '',
    language: 'ar'
  },
  {
    name: this.form['nameEn'].value || '',
    language: 'en'
  }
];

    const customerServiceIDFK = this.form['customerServiceIDFK'].value;
    const url = this.form['url'].value;


    

    let response;

    if (this.environmentService.SelectedData) {
      const environmentUpdate: EnvironmentUpdateRequest = {
        uuid: this.environmentService.SelectedData.uuid,
        customerServiceIDFK,
        url,
        environmentTranslation: environmentTranslations
      };
      response = await this.environmentService.Update(environmentUpdate);
    } else {
      const environmentAdd: EnvironmentRequest = {
        customerServiceIDFK,
        url,
        environmentTranslation: environmentTranslations
      };
      response = await this.environmentService.Add(environmentAdd);
    }

    if (response?.requestStatus?.toString() === '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (!this.environmentService.SelectedData) {
        this.resetForm();
      } else {
        setTimeout(() => {
          this.environmentService.Dialog?.adHostChild?.viewContainerRef.clear();
          this.environmentService.Dialog?.adHostDynamic?.viewContainerRef.clear();
        }, 600);
      }
    } else {
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage || 'Operation failed.');
    }
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
      customerServiceIDFK: environment.customerServiceIDFK || '',
      nameAr: ar?.name || '',
      nameEn: en?.name || '',
      url: environment.url || ''
    });
  }

  async retrieveCustomerServices() {
  const filter = {
    name: '',
    uuid: '',
    pageIndex: '0',
    pageSize: '100000',
    IncludeCustomer: '1',   
    IncludeService: '1'     
  };

  const response = await this.environmentService.Search(filter) as any;
  console.log('Search response:', response);
  const lang = this.layoutService.config.lang || 'en';

 this.customerServices = (response.data || []).map((service: any) => {
  const customerTranslation = service.customer?.customerTranslation?.[lang]?.name;
  const serviceTranslation = service.service?.serviceTranslation?.[lang]?.name;

  return {
    label: customerTranslation || serviceTranslation || '—',
    value: service.uuid
  };
});

}

  }

