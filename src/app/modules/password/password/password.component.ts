import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { EmployeesService } from 'src/app/Core/services/employees.service';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { LayoutService } from 'src/app/layout/service/layout.service';


@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  providers: [MessageService]
})
export class PasswordComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public employeeService: EmployeesService,
    public companyService: CompaniesService, 
    public constantService: ConstantService,
    public translate: TranslateService
  ) {
    this.dataForm = formBuilder.group({
      firstNameAr: [''],
      lastNameAr: [''],
      firstNameEn: [''],
      lastNameEn: [''],
      username: [''],
      password: [''],

    })
  }

  async ngOnInit() {
    try {
      this.loading = true;
      this.dataForm.controls['password'].disable()
      this.dataForm.controls['username'].disable()
      this.dataForm.controls['firstNameAr'].disable()
      this.dataForm.controls['lastNameAr'].disable()
      this.dataForm.controls['firstNameEn'].disable()
      this.dataForm.controls['lastNameEn'].disable()

      

        await this.FillData();
      
    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async onSubmit() {
    try {
      this.btnLoading = true;

    } catch (exceptionVar) {
    } finally {
      this.btnLoading = false;
    }
  }

async FillData() {
  let temp;

  if (this.employeeService.SelectedData != null ) {
    temp = {
      firstNameAr: this.employeeService.SelectedData?.user.userTranslation?.['ar']?.firstName || '',
      lastNameAr: this.employeeService.SelectedData?.user.userTranslation?.['ar']?.lastName || '',
      firstNameEn: this.employeeService.SelectedData?.user.userTranslation?.['en']?.firstName || '',
      lastNameEn: this.employeeService.SelectedData?.user.userTranslation?.['en']?.lastName || '',
      username: this.employeeService.SelectedData?.user.username || '',
      password: this.employeeService.SelectedData?.password || ''
    };
  }

  if (this.companyService.SelectedData != null) {
    console.log("company response",this.companyService.SelectedData);
   
    let user = this.companyService.SelectedData.user as any;

    if (!user) {
      user = {
        username: this.companyService.SelectedData.phone || '',
        password: '',
        userTranslation: {
          ar: { firstName: this.companyService.SelectedData.companyTranslation?.['ar']?.name || '', lastName: '' },
          en: { firstName: this.companyService.SelectedData.companyTranslation?.['en']?.name || '', lastName: '' }
        }
      };
    } else {
    
      user.password = user.password || '';
      user.userTranslation = user.userTranslation || {
        ar: { firstName: this.companyService.SelectedData.companyTranslation?.['ar']?.name || '', lastName: '' },
        en: { firstName: this.companyService.SelectedData.companyTranslation?.['en']?.name || '', lastName: '' }
      };
    }

    temp = {
      firstNameAr: user.userTranslation?.['ar']?.firstName || '',
      lastNameAr:'',
      firstNameEn: user.userTranslation?.['en']?.firstName || '',
      lastNameEn: '',
      username: user.username || '',
      password: user.password || ''
    };
  }

  this.dataForm.patchValue(temp);
}

}
