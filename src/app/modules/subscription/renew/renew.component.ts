import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { RenewRequest } from '../../renews/renews.module';
import { SubscriptionService } from 'src/app/Core/services/subscription.service';
import { RenewService } from 'src/app/Core/services/renew.service';
import { CompanyServiceService } from 'src/app/layout/service/companyService.service';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';


@Component({
  selector: 'app-renew',
  templateUrl: './renew.component.html',
  styleUrls: ['./renew.component.scss'],
  providers: [MessageService]
})
export class RenewComponent implements OnInit {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  durationTypeList: ConstantResponse[] = [];
  newEndDate: Date = new Date();
  companyServiceName: string;


  constructor(public formBuilder: FormBuilder,
    public messageService: MessageService,
    public layoutService: LayoutService,
    public subscriptionService: SubscriptionService,
    public companyService: CompanyServiceService,
    public renewService: RenewService,
    public constantService: ConstantService,


  ) {
    this.dataForm = this.formBuilder.group({
      period_number: ['', [Validators.required, this.integerValidator()]],
      period_type: ['', Validators.required],
      newEndDate: ['']

    })
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }
  calculateNewEndDate() {
    const oldEndDate = this.subscriptionService.SelectedData?.endDate
      ? new Date(this.subscriptionService.SelectedData.endDate)
      : null;
    const periodNumber = Number(this.dataForm.controls['period_number'].value);
    const periodTypeKey = this.dataForm.controls['period_type'].value;

    if (!oldEndDate || !periodNumber || !periodTypeKey) {
      this.newEndDate = oldEndDate || new Date();

      return;
    }

    const newDate = new Date(oldEndDate);

    switch (periodTypeKey) {
      case 1:
        newDate.setDate(newDate.getDate() + periodNumber);
        break;
      case 2:
        newDate.setDate(newDate.getDate() + periodNumber * 7);
        break;
      case 3:
        newDate.setMonth(newDate.getMonth() + periodNumber);
        break;
      case 4:
        newDate.setFullYear(newDate.getFullYear() + periodNumber);
        break;
      default:
        break;
    }

    this.newEndDate = newDate;
  }
  async ngOnInit() {
    try {
      this.loading = true;
      const durationTypeResponse = await this.constantService.Search('DurationType') as any;
      this.durationTypeList = durationTypeResponse.data;

      if (this.subscriptionService.SelectedData != null) {
        const companyName = this.subscriptionService.SelectedData?.companyService?.company?.companyTranslation?.[this.layoutService.config.lang]?.name || ''
        const serviceName = this.subscriptionService.SelectedData?.companyService?.service?.serviceTranslation?.[this.layoutService.config.lang]?.name || ''
        this.companyServiceName = companyName + ' - ' + serviceName
      }

      if (this.renewService.SelectedData != null) {
        const companyName = this.renewService.SelectedData?.companyService?.company?.companyTranslation?.[this.layoutService.config.lang].name || ''
        const serviceName = this.renewService.SelectedData?.companyService?.service?.serviceTranslation?.[this.layoutService.config.lang].name || ''
        this.companyServiceName = companyName + serviceName
        await this.FillData();
        this.dataForm.get('period_number')?.valueChanges.subscribe(() => this.calculateNewEndDate());
        this.dataForm.get('period_type')?.valueChanges.subscribe(() => this.calculateNewEndDate());
      } else {
        this.resetForm();
      }


      this.calculateNewEndDate();

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    try {
      this.btnLoading = true;

      if (this.dataForm.invalid) {
        this.submitted = true;
        return;
      }
      await this.Save();

    } catch (exceptionVar) {
    }
    finally {
      this.btnLoading = false;
    }
  }

  async FillData() {


    var form = {
      uuid: this.renewService.SelectedData?.uuid,
      date: this.renewService.SelectedData?.date,
      subscriptionIDFK: this.renewService.SelectedData?.subscriptionIDFK,
      companyServiceIDFK: this.renewService.SelectedData?.companyServiceIDFK,
      period_number: this.renewService.SelectedData?.durationValue,
      period_type: Number(this.renewService.SelectedData?.durationType),
      newEndDate: this.renewService.SelectedData?.newEndDate
    }
    this.dataForm.patchValue(form)

  }

  async Save() {

    var renew: RenewRequest = {
      uuid: this.renewService.SelectedData == null ? '' : this.renewService.SelectedData.uuid,
      subscriptionIDFK: this.renewService.SelectedData == null ? this.subscriptionService.SelectedData?.uuid : this.renewService.SelectedData.subscriptionIDFK?.toString(),
      companyServiceIDFK: this.subscriptionService.SelectedData?.companyServiceIDFK.toString(),
      durationValue: this.dataForm.controls['period_number'].value.toString(),
      durationType: this.dataForm.controls['period_type'].value.toString(),



    }
    let response;
    if (this.renewService.SelectedData == null) {
      response = await this.renewService.Add(renew)
    }
    else {

      response = await this.renewService.Update(renew)
    }

    if (response.requestStatus == "200") {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);

      this.companyService.Dialog?.Close();

    }
    else {
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
    }
    this.btnLoading = false;
    this.submitted = false;

  }

  resetForm() {
    if (this.renewService.SelectedData == null) {
      this.dataForm.reset();
    }
  }

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isInteger = Number.isInteger(Number(value)); // Check if the value is an integer
      return isInteger ? null : { 'notInteger': { value } }; // Return an error object if not an integer
    };

  }


}
