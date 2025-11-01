import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { CompanyRequest, CompanyUpdateRequest } from '../companies.module';
import { TranslateService } from '@ngx-translate/core';
import { PasswordComponent } from '../../password/password/password.component';

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
    public companyService: CompaniesService,
    public translate: TranslateService
  ) {
    this.dataForm = this.formBuilder.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      primaryContact: ['', Validators.required],
      email: [''],
      phone: ['', Validators.required],
       username: [''],  
      password: ['']   
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
       if (response.requestStatus == "200") {
        this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);
        this.companyService.Dialog.adHostChild.viewContainerRef.clear();
        this.companyService.Dialog.adHostDynamic.viewContainerRef.clear();
        setTimeout(() => {
          this.companyService.Dialog.adHostChild.viewContainerRef.clear();
          this.companyService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.companyService.triggerRefreshCompanies();
        }, 600);
      } else {
        this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
      }
    } else {
      // add
      var addCompany: CompanyRequest = {
        companyTranslation: companyTranslation,
        primaryContact: this.dataForm.controls['primaryContact'].value == null ? null : this.dataForm.controls['primaryContact'].value.toString(),
        email: this.dataForm.controls['email'].value == null ? null : this.dataForm.controls['email'].value.toString(),
        phone: this.dataForm.controls['phone'].value == null ? null : this.dataForm.controls['phone'].value.toString(),
        
      };


      response = await this.companyService.Add(addCompany);
      console.log('Add Company Response:', response);
   if (response != null) {
        if (response.requestStatus == 200) {
          this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
          this.companyService.SelectedData = {
    ...response,
    user: {
        username: response.phone,  
        password: response.password || ''  
    }
};
          this.OpenInfoPage(this.companyService.SelectedData);
          this.companyService.Dialog.close();
          setTimeout(() => {
            this.companyService.Dialog.adHostChild.viewContainerRef.clear();
            this.companyService.Dialog.adHostDynamic.viewContainerRef.clear();
            this.companyService.triggerRefreshCompanies();
          }, 600);

        } else {
          this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
        }
  
}
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
      username: this.companyService.SelectedData?.user?.username || '',  
      password: this.companyService.SelectedData?.password || ''       
    };
    this.dataForm.patchValue(temp);
  }
  async OpenInfoPage(response) {
  console.log('Data received in Info Page:', response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
   this.companyService.SelectedData = response
      let content = 'Info';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
   var component = this.layoutService.OpenDialog(PasswordComponent, content);
    this.companyService.Dialog = component;

    component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        setTimeout(() => {
            this.companyService.Dialog.adHostChild.viewContainerRef.clear();
            this.companyService.Dialog.adHostDynamic.viewContainerRef.clear();
            this.companyService.triggerRefreshCompanies();
        }, 600);
        this.FillData();
    });

   
    }
}
