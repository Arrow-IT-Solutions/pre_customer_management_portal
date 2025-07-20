import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomersService } from 'src/app/layout/service/customers.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { CustomerRequest, CustomerUpdateRequest } from '../customers.module';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  providers: [MessageService]
})
export class AddCustomerComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  constructor(public formBuilder: FormBuilder,
    public messageService: MessageService,
    public customer: CustomersService,
    public layoutService: LayoutService,
    public customerService: CustomersService
  ) {
    this.dataForm = this.formBuilder.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      primaryContact: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      anyDeskAddress: ['', Validators.required]
    })
  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }
  async ngOnInit() {
    try {
      this.loading = true;

      if (this.customerService.SelectedData != null) {
        await this.FillData();
      }
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
    } finally {
      this.btnLoading = false;
    }
  }

  async Save() {

    let response;

    var customerTranslation = [
      {
        name: this.dataForm.controls['nameAr'].value == null ? '' : this.dataForm.controls['nameAr'].value.toString(),
        language: 'ar'
      },
      {
        name: this.dataForm.controls['nameEn'].value == null ? '' : this.dataForm.controls['nameEn'].value.toString(),
        language: 'en'
      }
    ];

    if (this.customerService.SelectedData != null) {
      // update
      var updateCustomer: CustomerUpdateRequest = {
        uuid: this.customerService.SelectedData?.uuid?.toString(),
        customerTranslation: customerTranslation,
        primaryContact: this.dataForm.controls['primaryContact'].value == null ? null : this.dataForm.controls['primaryContact'].value.toString(),
        anydeskAddress: this.dataForm.controls['anyDeskAddress'].value == null ? null : this.dataForm.controls['anyDeskAddress'].value.toString(),
        email: this.dataForm.controls['email'].value == null ? null : this.dataForm.controls['email'].value.toString(),
        phone: this.dataForm.controls['phone'].value == null ? null : this.dataForm.controls['phone'].value.toString(),

      };

      response = await this.customerService.Update(updateCustomer);
    } else {
      // add
      var addCustomer: CustomerRequest = {
        customerTranslation: customerTranslation,
        primaryContact: this.dataForm.controls['primaryContact'].value == null ? null : this.dataForm.controls['primaryContact'].value.toString(),
        anydeskAddress: this.dataForm.controls['anyDeskAddress'].value == null ? null : this.dataForm.controls['anyDeskAddress'].value.toString(),
        email: this.dataForm.controls['email'].value == null ? null : this.dataForm.controls['email'].value.toString(),
        phone: this.dataForm.controls['phone'].value == null ? null : this.dataForm.controls['phone'].value.toString(),
      };


      response = await this.customerService.Add(addCustomer);
    }

    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (this.customerService.SelectedData == null) {
        this.resetForm();
        setTimeout(() => {
          this.customerService.Dialog.adHostChild.viewContainerRef.clear();
          this.customerService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.customerService.triggerRefreshCustomers();
        }, 600);
      } else {
        setTimeout(() => {
          this.customerService.Dialog.adHostChild.viewContainerRef.clear();
          this.customerService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.customerService.triggerRefreshCustomers();
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
  }

  FillData() {
    let temp = {
      nameAr: this.customerService.SelectedData?.customerTranslation!['ar'].name,
      nameEn: this.customerService.SelectedData?.customerTranslation!['en'].name,
      anyDeskAddress: this.customerService.SelectedData?.anydeskAddress,
      email: this.customerService.SelectedData?.email,
      phone: this.customerService.SelectedData?.phone,
      primaryContact: this.customerService.SelectedData?.primaryContact,
    };
    this.dataForm.patchValue(temp);
  }
}
