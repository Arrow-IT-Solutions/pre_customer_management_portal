import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServiceRequest, ServiceUpdateRequest } from '../services.module';
import { ServicesService } from 'src/app/Core/services/services.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
  providers: [MessageService]
})
export class AddServiceComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public messageService: MessageService,
    public servicesService: ServicesService,
    public layoutService: LayoutService
  ) {
    this.dataForm = this.formBuilder.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      desc: ['', Validators.required] 
    });
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    if (this.servicesService.SelectedData) {
      await this.FillData();
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    this.btnLoading = true;
    try {
      await this.Save();
    } finally {
      this.btnLoading = false;
    }
  }

  async Save() {
  let response;
  const sharedDescription = this.dataForm.controls['desc'].value || '';

  const serviceTranslations = [
    {
      name: this.dataForm.controls['nameAr'].value || '',
      description: sharedDescription,
      language: 'ar'
    },
    {
      name: this.dataForm.controls['nameEn'].value || '',
      description: sharedDescription,
      language: 'en'
    }
  ];

  if (this.servicesService.SelectedData) {
    const serviceUpdate: ServiceUpdateRequest = {
      uuid: this.servicesService.SelectedData.uuid,
      description: sharedDescription, 
      serviceTranslation: serviceTranslations
    };
    response = await this.servicesService.Update(serviceUpdate);
  } else {
    const serviceAdd: ServiceRequest = {
      description: sharedDescription,
      serviceTranslation: serviceTranslations
    };
    response = await this.servicesService.Add(serviceAdd);
  }

  if (response?.requestStatus?.toString() === '200') {
    this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
    if (!this.servicesService.SelectedData) {
      this.resetForm();
    } else {
     setTimeout(() => {
          this.servicesService.Dialog.adHostChild.viewContainerRef?.clear();
          this.servicesService.Dialog.adHostDynamic.viewContainerRef?.clear();
        }, 600);
      }
    }  else {
    this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
  }

  this.submitted = false;
}


  resetForm() {
    this.dataForm.reset();
  }

  async FillData() {
  const ar = this.servicesService.SelectedData?.serviceTranslation?.['ar'];
  const en = this.servicesService.SelectedData?.serviceTranslation?.['en'];

  const temp = {
    nameAr: ar?.name || '',
    nameEn: en?.name || '',
    desc: this.servicesService.SelectedData?.description || ''
  };

  this.dataForm.patchValue(temp);
}

}
