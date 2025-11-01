import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { RenewRequest, RenewResponse, RenewSearchRequest } from '../renews.module';
import { RenewService } from 'src/app/Core/services/renew.service';
import { RenewComponent } from '../../subscription/renew/renew.component';
import { ProvisionedServiceResponse, ProvisionedServiceSearchRequest } from '../../wizard-to-add/wizard-to-add.module';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
@Component({
  selector: 'app-renews',
  templateUrl: './renews.component.html',
  styleUrls: ['./renews.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class RenewsComponent implements OnInit {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  visible: boolean = false;
  dataForm!: FormGroup;
  loading = false;
  isResetting: boolean = false;
  doneTypingInterval = 1000;
  typingTimer: any;
  data: RenewResponse[] = [];
  companies: ProvisionedServiceResponse[] = [];
  durationTypeList: ConstantResponse[] = [];
  constructor(
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public renewService: RenewService,
    public companyService: ProvisionedService,
    public constantService: ConstantService,
  ) {
    this.dataForm = this.formBuilder.group({
      com_name: [''],
      startDate: ['',],
      endDate: ['',],
      type_period: ['']

    });

  }

  async ngOnInit() {
    await this.FillData();
    await this.FillCompanies();
    const durationTypeResponse = await this.constantService.Search('DurationType') as any;
    this.durationTypeList = durationTypeResponse.data;
  }

  Search() {
    this.FillData();
  }

  async FillData(pageIndex: number = 0) {

    this.loading = true;

    let fromDate
    if (this.dataForm.controls['startDate'].value == null || this.dataForm.controls['startDate'].value == '') {
      fromDate = '';
    }
    else {
      fromDate = new Date(this.dataForm.controls['startDate'].value.toISOString())
    }
    let toDate
    if (this.dataForm.controls['endDate'].value == null || this.dataForm.controls['endDate'].value == '') {
      toDate = '';
    } else {
      toDate = new Date(this.dataForm.controls['endDate'].value.toISOString());
    }

    let filter: RenewSearchRequest =
    {
      uuid: '',
      subscriptionIDFK: '',
      companyServiceIDFK: this.dataForm.controls['com_name'].value == null ? '' : this.dataForm.controls['com_name'].value.toString(),
      durationValue: '',
      durationType: this.dataForm.controls['type_period'].value == null ? '' : this.dataForm.controls['type_period'].value.toString(),
      FromDate: fromDate.toLocaleString(),
      ToDate: toDate.toLocaleString(),
      pageSize: this.pageSize.toString(),
      pageIndex: pageIndex.toString(),
    }
    const response = await this.renewService.Search(filter);
    this.data = response.data;
    this.totalRecords = response.totalRecords;
    this.loading = false;

  }


  async confirmDelete(row: RenewResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.renewService.Delete(row.uuid!) as any;
          this.layoutService.showSuccess(this.messageService, 'toast', true, resp?.requestMessage || 'Deleted');
          this.FillData();

        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Error'),
            detail: this.translate.instant('database.Failed_to_delete')
          });
        }
      }
    });
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
    this.FillData(event.first)

  }

  OnChange() {
    if (this.isResetting) { return };

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);

  }

  showDialog(link: string) {

    this.visible = true;
  }

  openDialog(row: RenewResponse | null = null) {

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.renewService.SelectedData = row;

    let content = row == null ? 'Create_Renew' : 'Update_Renew';
    this.translate.get(content).subscribe((res: string) => {
      content = res;
    });

    const component = this.layoutService.OpenDialog(RenewComponent, content);
    this.renewService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.renewService.SelectedData = null;
      this.FillData();
    });

  }

  async FillCompanies() {
    const filter = {
      uuid: '',
      companyIDFK: '',
      serviceIDFK: '',
      includeCompany: '1',
      includeService: '1',
      pageIndex: '0',
      pageSize: '10'
    };

    const response = await this.companyService.Search(filter) as any;
    this.companies = response.data

    await this.ReWriteCompany();
  }


  ReWriteCompany(): any {

    var companyDTO: any[] = []

    this.companies.map(company => {
      const translationCompany = company.company?.companyTranslation?.[this.layoutService.config.lang] as any;
      const companyName = translationCompany?.name;
      const translationService = company.service?.serviceTranslation?.[this.layoutService.config.lang] as any;
      const serviceName = translationService?.name;

      var obj =
      {
        ...company,
        name: `${companyName + '-' + serviceName}`.trim()

      }

      companyDTO.push(obj)

    })

    this.companies = companyDTO;



  }

  async FillCompany(event: any = null) {

    let filterInput = '';
    if (event != null) {
      filterInput = event.filter
    }

    let filter: ProvisionedServiceSearchRequest = {
      uuid: '',
      companyIDFK: '',
      serviceIDFK: '',
      companyName: filterInput,
      includeCompany: '1',
      includeService: '1',
      pageIndex: "",
      pageSize: "10"

    };

    const response = (await this.companyService.Search(filter)) as any;
    this.companies = response.data
    await this.ReWriteCompany();
  }



}
