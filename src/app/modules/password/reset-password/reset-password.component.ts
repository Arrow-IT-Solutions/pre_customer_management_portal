import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { EmployeesService } from 'src/app/Core/services/employees.service';
import { UserService } from 'src/app/Core/services/user.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EmployeeResetPass } from '../password.module';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
   providers: [MessageService]
})
export class ResetPasswordComponent {
 dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public employeeService: EmployeesService,
    public constantService: ConstantService,
    public translate: TranslateService,
    public userService: UserService,
    public messageService: MessageService
  ) {
    this.dataForm = formBuilder.group({
      password: ['', Validators.required],

    })
  }

  async ngOnInit() {
    try {
    } catch (exceptionVar) {
      console.log(exceptionVar);
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
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

    if (this.employeeService.SelectedData != null) {
      var employee: EmployeeResetPass = {
        uuid: this.employeeService.SelectedData?.user?.uuid?.toString(),
        password: this.dataForm.controls['password'].value.toString()

      };
      response = await this.userService.EmployeeResetPass(employee);
      if (response?.requestStatus?.toString() == '200') {
        this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
        setTimeout(() => {
          this.employeeService.Dialog.adHostChild.viewContainerRef.clear();
          this.employeeService.Dialog.adHostDynamic.viewContainerRef.clear();
        }, 600);

      } else {
        this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);

      }

    }

    this.btnLoading = false;
    this.submitted = false;
  }
}
