import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { ConstantResponse } from 'src/app/Core/services/constant.service';
import { SubscriptionRequest, SubscriptionUpdateRequest } from '../subscription.module';
import { SubscriptionService } from 'src/app/Core/services/subscription.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { CompanyServiceResponse, ProvisionedServiceSearchRequest } from '../../wizard-to-add/wizard-to-add.module';
import { companyServiceResponse } from '../../company-service/company-service.module';
import { CompanyServiceService } from 'src/app/layout/service/companyService.service';

@Component({
  selector: 'app-add-subscripe',
  templateUrl: './add-subscripe.component.html',
  styleUrls: ['./add-subscripe.component.scss'],
  providers: [MessageService]
})
export class AddSubscripeComponent {
  dataForm!: FormGroup;
  submitted = false;
  btnLoading = false;
  loading = false;
  statusList: ConstantResponse[] = [];
  companyServices: CompanyServiceResponse[] = [];
  companyServiceOptions: { label: string; value: string }[] = [];
  companyServiceList: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public subscripeService: SubscriptionService,
    public constantService: ConstantService,
    public companyService: CompanyServiceService,
    public provisionedService: ProvisionedService,
    public messageService: MessageService,
    public translate: TranslateService
  ) {
    this.dataForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
      companyServiceIDFK: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.loading = true;
      const response = await this.constantService.Search('SubscriptionStatus') as any;
      this.statusList = response?.data ?? [];
      await this.RetrieveCompanyServices();
      this.resetForm();

      if (this.subscripeService.SelectedData != null) {
        await this.FillData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      return;
    }
    try {
      this.btnLoading = true;

      if (this.dataForm.invalid) {
        console.warn('Form is invalid:', this.dataForm.value);
        this.submitted = true;
        return;
      }


      await this.Save();
    } catch (err) {
      console.error(err);
    } finally {
      this.btnLoading = false;
    }
  }


  async Save() {

    let response;



    if (this.subscripeService.SelectedData != null) {
      // update
      var updateSubscripe: SubscriptionUpdateRequest = {
        startDate: new Date(this.dataForm.value.startDate).toISOString(),
        endDate: new Date(this.dataForm.value.endDate).toISOString(),
        price: this.dataForm.controls['price'].value.toString(),
        companyServiceIDFK: this.dataForm.controls['companyServiceIDFK'].value,
        uuid: this.subscripeService.SelectedData?.uuid?.toString(),
        status: this.dataForm.controls['status'].value.toString(),

      };
      response = await this.subscripeService.Update(updateSubscripe);
    } else {
      // add
      var addSubscripe: SubscriptionRequest = {
        startDate: new Date(this.dataForm.value.startDate).toISOString(),
        endDate: new Date(this.dataForm.value.endDate).toISOString(),
        price: this.dataForm.controls['price'].value.toString(),
        companyServiceIDFK: this.dataForm.controls['companyServiceIDFK'].value,
        status: this.dataForm.controls['status'].value.toString(),

      };

      response = await this.subscripeService.Add(addSubscripe);
    }

    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (this.subscripeService.SelectedData == null) {
        this.resetForm();
        setTimeout(() => {

          this.subscripeService.Dialog.adHostChild.viewContainerRef.clear();
          this.subscripeService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.subscripeService.triggerRefreshSubscription();
        }, 600);
      } else {
        setTimeout(() => {
          this.subscripeService.Dialog.adHostChild.viewContainerRef.clear();
          this.subscripeService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.subscripeService.triggerRefreshSubscription();
        }, 600);
      }
    } else {
      console.error('Error response:', response);
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
    }

    this.btnLoading = false;
    this.submitted = false;
  }
  resetForm() {
    this.dataForm.reset();
  }

  async FillData() {

    const temp = {
      startDate: this.subscripeService.SelectedData?.startDate ? new Date(this.subscripeService.SelectedData.startDate) : null,
      endDate: this.subscripeService.SelectedData?.endDate ? new Date(this.subscripeService.SelectedData.endDate) : null,
      price: this.subscripeService.SelectedData?.price,
      status: Number(this.subscripeService.SelectedData?.status),
      companyServiceIDFK: this.subscripeService.SelectedData?.companyService.uuid ?? ''

    };

    this.dataForm.patchValue(temp);
  }

  getStatusLabel(): string {
    return this.layoutService.config.lang == 'ar' ? 'nameAr' : 'nameEn';
  }
  getCompanyServiceLabel(): string {
    return this.layoutService.config.lang === 'ar' ? 'nameAr' : 'nameEn';
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



    this.companyServiceList = rawResponse.data;

    const lang = this.layoutService.config.lang || 'en';


    this.companyServiceOptions = (rawResponse.data ?? []).map((item: any) => ({
      label: `${item.company?.companyTranslation?.[lang]?.name ?? 'Unknown Company'} - ${item.service?.serviceTranslation?.[lang]?.name ?? 'Unknown Service'}`,
      value: item.uuid
    }));

  }





  //   async filterCustomerServices(event: any) {
  //   const filterInput = event?.filter || '';
  //   const filter: CustomerSearchRequest = { name: filterInput, uuid: '', pageIndex: '', pageSize: '10' };
  //   const response = await this.customerService.Search(filter) as any;
  //   const lang = this.layoutService.config.lang || 'en';

  //   this.customerServices = response.data.map((item: any) => {
  //     const customerName = item.customer?.customerTranslation?.[lang]?.name || '—';
  //     const serviceName = item.service?.serviceTranslation?.[lang]?.name || '—';

  //     return {
  //       ...item,
  //       name: `${customerName} - ${serviceName}`
  //     };
  //   });
  // }


}
