import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { CompanyRequest, CompanyUpdateRequest } from '../companies.module';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  providers: [MessageService]
})
export class AddCompanyComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  constructor(public formBuilder: FormBuilder,
    public messageService: MessageService,
    public company: CompaniesService,
    public layoutService: LayoutService,
    public companyService: CompaniesService
  ) {
    this.dataForm = this.formBuilder.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      primaryContact: ['', Validators.required],
      email: [''],
      phone: ['', Validators.required]
    })
  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }
  async ngOnInit() {
    try {
      this.loading = true;

      if (this.companyService.SelectedData != null) {
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

    var companyTranslation = [
      {
        name: this.dataForm.controls['nameAr'].value == null ? '' : this.dataForm.controls['nameAr'].value.toString(),
        language: 'ar'
      },
      {
        name: this.dataForm.controls['nameEn'].value == null ? '' : this.dataForm.controls['nameEn'].value.toString(),
        language: 'en'
      }
    ];

    if (this.companyService.SelectedData != null) {
      // update
      var updateCompany: CompanyUpdateRequest = {
        uuid: this.companyService.SelectedData?.uuid?.toString(),
        companyTranslation: companyTranslation,
        primaryContact: this.dataForm.controls['primaryContact'].value == null ? null : this.dataForm.controls['primaryContact'].value.toString(),
        email: this.dataForm.controls['email'].value == null ? null : this.dataForm.controls['email'].value.toString(),
        phone: this.dataForm.controls['phone'].value == null ? null : this.dataForm.controls['phone'].value.toString(),

      };

      response = await this.companyService.Update(updateCompany);
    } else {
      // add
      var addCompany: CompanyRequest = {
        companyTranslation: companyTranslation,
        primaryContact: this.dataForm.controls['primaryContact'].value == null ? null : this.dataForm.controls['primaryContact'].value.toString(),
        email: this.dataForm.controls['email'].value == null ? null : this.dataForm.controls['email'].value.toString(),
        phone: this.dataForm.controls['phone'].value == null ? null : this.dataForm.controls['phone'].value.toString(),
      };


      response = await this.companyService.Add(addCompany);
    }

    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (this.companyService.SelectedData == null) {
        this.resetForm();
        setTimeout(() => {
          this.companyService.Dialog.adHostChild.viewContainerRef.clear();
          this.companyService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.companyService.triggerRefreshCompanies();
        }, 600);
      } else {
        setTimeout(() => {
          this.companyService.Dialog.adHostChild.viewContainerRef.clear();
          this.companyService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.companyService.triggerRefreshCompanies();
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
      nameAr: this.companyService.SelectedData?.companyTranslation!['ar'].name,
      nameEn: this.companyService.SelectedData?.companyTranslation!['en'].name,
      email: this.companyService.SelectedData?.email,
      phone: this.companyService.SelectedData?.phone,
      primaryContact: this.companyService.SelectedData?.primaryContact,
    };
    this.dataForm.patchValue(temp);
  }
}
