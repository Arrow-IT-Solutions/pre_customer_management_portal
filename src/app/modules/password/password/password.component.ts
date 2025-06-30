import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { EmployeesService } from 'src/app/Core/services/employees.service';
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

      if (this.employeeService.SelectedData != null) {
        console.log('Selected Data From Pass Component')
        await this.FillData();
      }
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

    console.log('HERE')
    let temp = {
      firstNameAr: this.employeeService.SelectedData?.user.userTranslation!['ar'].firstName,
      lastNameAr: this.employeeService.SelectedData?.user.userTranslation!['ar'].lastName,
      firstNameEn: this.employeeService.SelectedData?.user.userTranslation!['en'].firstName,
      lastNameEn: this.employeeService.SelectedData?.user.userTranslation!['en'].lastName,
      username: this.employeeService.SelectedData?.user.username,
      password: this.employeeService.SelectedData?.password
    };
    this.dataForm.patchValue(temp);

  }
}
