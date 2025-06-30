import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeesService } from 'src/app/Core/services/employees.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EmployeeSearchRequest, EmployeesResponse, EmployeeTranslationResponse } from '../employees.module';
import { PasswordComponent } from '../../password/password/password.component';
import { ResetPasswordComponent } from '../../password/reset-password/reset-password.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class EmployeesComponent {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  dataForm!: FormGroup;
  loading = false;
  data: EmployeesResponse[] = [];
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  ClientTotal: number = 0;
  link = '';
  visible: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public employeeService: EmployeesService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService) {
    this.dataForm = this.formBuilder.group({
      employeeName: [''],
      phone: [''],
      id: [''],
      role: [''],
      userName: ['']
    });

    this.employeeService.refreshEmployees$.subscribe(() => {
      this.FillData();
    });
  }
  async ngOnInit() {
    await this.FillData();
  }
  Search() {
    this.FillData();
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.totalRecords = 0;
    let filter: EmployeeSearchRequest = {
      name: this.dataForm.controls['employeeName'].value,
      phone: this.dataForm.controls['phone'].value,
      includeUser: '1',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),
    };
    const response = (await this.employeeService.Search(filter)) as any;
    console.log(response)
    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.totalRecords = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.totalRecords = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;
  }

  openDialog(row: EmployeesResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.employeeService.SelectedData = row
    let content = this.employeeService.SelectedData == null ? 'Create_Employee' : 'Update_Employee';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(AddEmployeeComponent, content);
    this.employeeService.Dialog = component;

    //console.log("component : ",component);

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      if (row == null)
        this.OpenInfoPage(this.employeeService.SelectedData)
    });
  }
  getFirstChar(trans: { [key: string]: EmployeeTranslationResponse } | undefined): string {
    console.log('xxxxxxxxxxxxxxxx');

    console.log('trans : ', trans);
    var char = 'U';

    if (trans == undefined || trans == null) {
      char = this.layoutService.config.lang == 'ar' ? 'غ' : 'U';
    } else {
      var response;

      if (this.layoutService.config.lang == 'ar') {
        response = trans!['ar'];
        char = response == null ? 'غ' : response!.firstName!.split('')[0].toUpperCase();
      } else {
        response = trans!['en'];
        char = response == null ? 'U' : response!.firstName!.split('')[0].toUpperCase();
      }
    }
    console.log('char : ', char);

    return char;
  }
  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }

  OnChange() {
    if (this.isResetting) { return }; // Do nothing if resetting

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);

  }

  paginate(event: any) {
    this.pageSize = event.rows
    this.first = event.first
    this.FillData(event.first)

  }

  showDialog(link: string) {
    this.link = link;
    this.visible = true;
  }

  confirmDelete(row: EmployeesResponse) {

    console.log(row)
    this.confirmationService.confirm({
      message: this.translate.instant("Do_you_want_to_delete_this_record?"),
      header: this.translate.instant("Delete_Confirmation"),
      icon: 'pi pi-info-circle',
      key: 'positionDialog',
      closeOnEscape: true,
      accept: async () => {
        const response = (await this.employeeService.Delete(row.uuid!)) as any;

        this.confirmationService.close();

        this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);

        this.FillData();

      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      },
    });
  }

  async OpenInfoPage(response) {

    console.log('here')
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.employeeService.SelectedData = response
    console.log('selectedData', this.employeeService.SelectedData)
    let content = 'Info';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
   var component = this.layoutService.OpenDialog(PasswordComponent, content);
   this.employeeService.Dialog = component;
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }

  resetPass(row: EmployeesResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.employeeService.SelectedData = row
    let content = 'ResetPassword_Employee';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
   var component = this.layoutService.OpenDialog(ResetPasswordComponent, content);
    this.employeeService.Dialog = component;
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      if (this.employeeService.submitted == 'submitted') {
        this.FillData();
      }
    });
   }

}
