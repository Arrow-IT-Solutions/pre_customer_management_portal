import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { CompanyResponse, CompanySearchRequest } from '../companies.module';
import { AddCompanyComponent } from '../add-company/add-company.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class CompaniesComponent {
      dataForm!: FormGroup;
      loading = false;
      pageSize: number = 12;
      first: number = 0;
      totalRecords: number = 0;
      data: CompanyResponse[] = [];
      companyTotal: number = 0;
      doneTypingInterval = 1000;
      typingTimer: any;
      isResetting: boolean = false;
      constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
        public translate: TranslateService,public companyService:CompaniesService, public messageService: MessageService,
        public confirmationService: ConfirmationService) {
        this.dataForm=this.formBuilder.group({
          name:[''],
          primaryContact:[''],
          email:[''],
          phone:['']

        })

      this.companyService.refreshCompanies$.subscribe(() => {
      this.FillData();
    });
      }

      async FillData(pageIndex: number = 0) {
  this.loading = true;
    this.data = [];
    this.companyTotal = 0;
    let filter: CompanySearchRequest = {
      uuid: '',
      name: this.dataForm.controls['name'].value,
      phone: this.dataForm.controls['phone'].value,
      primaryContact: this.dataForm.controls['primaryContact'].value,
      email: this.dataForm.controls['email'].value,
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),

    };

    const response = (await this.companyService.Search(filter)) as any;
    console.log('data',response)
    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.companyTotal = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.companyTotal = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;
      }

      async ngOnInit() {

        await this.FillData();

        }


  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }
  paginate(event: any) {
    this.pageSize = event.rows
    this.first = event.first
    this.FillData(event.first);

  }
      openAddCompany(row: CompanyResponse | null = null){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.companyService.SelectedData = row
    let content = this.companyService.SelectedData == null ? 'Create_Company' : 'Update_Company';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(AddCompanyComponent, content);
    this.companyService.Dialog = component;
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
      }

    confirmDelete(row: CompanyResponse) {

    console.log(row)
    this.confirmationService.confirm({
      message: this.translate.instant("Do_you_want_to_delete_this_record?"),
      header: this.translate.instant("Delete_Confirmation"),
      icon: 'pi pi-info-circle',
      key: 'positionDialog',
      closeOnEscape: true,
      accept: async () => {
        const response = (await this.companyService.Delete(row.uuid!)) as any;

        this.confirmationService.close();

        this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);

        this.FillData();

      },
      reject: () => {},
    });
  }

    OnChange()
  {
    if (this.isResetting) { return };

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);
  }

}
