import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { ConstantResponse } from 'src/app/Core/services/constant.service';
import { SubscriptionRequest, SubscriptionUpdateRequest } from '../subscription.module';
import { SubscriptionService } from 'src/app/Core/services/subscription.service';

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
  customerServiceList: any[] = [];
  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public subscripeService: SubscriptionService,
    public constantService: ConstantService,
    public messageService: MessageService,
    public translate: TranslateService
  ) {
    this.dataForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
      customerServiceIDFK: [''] 
    });
  }

  async ngOnInit() {
    try {
      this.loading = true;
      const response = await this.constantService.Search('SubscriptionStatus') as any;
      this.statusList = response?.data ?? [];
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
    try {
       console.log(' onSubmit triggered');
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
        customerServiceIDFK: 'af7ac44a-bbef-48be-8cde-bbcfe3b9a3ff',
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
        customerServiceIDFK: 'af7ac44a-bbef-48be-8cde-bbcfe3b9a3ff',
        status: this.dataForm.controls['status'].value.toString() ,

      };
     console.log(addSubscripe);

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
    customerServiceIDFK: this.subscripeService.SelectedData?.customerServiceIDFK ?? ''

    };
    console.log('Patch values:', temp);
    this.dataForm.patchValue(temp);
  }

  getStatusLabel(): string {
    return this.layoutService.config.lang == 'ar' ? 'nameAr' : 'nameEn';
  }
  getCustomerServiceLabel(): string {
  return this.layoutService.config.lang === 'ar' ? 'nameAr' : 'nameEn';
}

}
