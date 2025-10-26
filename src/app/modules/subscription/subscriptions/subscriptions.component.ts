import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { SubscriptionService } from 'src/app/Core/services/subscription.service';
import { AddSubscripeComponent } from '../add-subscripe/add-subscripe.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SubscriptionSearchRequest, SubscriptionResponse } from '../subscription.module';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { CompanyServiceService } from 'src/app/layout/service/companyService.service';
import { RenewComponent } from '../renew/renew.component';
import { RenewService } from 'src/app/Core/services/renew.service';
import { ProvisionedServiceResponse } from '../../wizard-to-add/wizard-to-add.module';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SubscriptionsComponent {
  dataForm!: FormGroup;
  loading = false;
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  data: SubscriptionResponse[] = [];
  statusList: ConstantResponse[] = [];
  companyServices: { [key: string]: string } = {};
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  companies: ProvisionedServiceResponse[];
  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public translate: TranslateService,
    public constantService: ConstantService,
    public provisionedService: ProvisionedService,
    public subscripeService: SubscriptionService,
    public companyService: CompanyServiceService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,

  ) {
    this.dataForm = this.formBuilder.group({
      status: [''],
      com_service: [''],
      startDate: [''],
      endDate: ['']

    });

    this.subscripeService.refreshList$.subscribe(() => {
      this.FillData();
    });
  }

  async ngOnInit() {
    this.loading = true;
    await this.retrieveCompanyService();
    await this.FillData();
    const response = await this.constantService.Search('SubscriptionStatus') as any;
    this.statusList = response?.data ?? [];
    this.loading = false;
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.totalRecords = 0;

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

    const filter: SubscriptionSearchRequest = {
      uuid: '',
      companyServiceIDFK: this.dataForm.controls['com_service'].value,
      status: this.dataForm.controls['status'].value == null ? '' : this.dataForm.controls['status'].value.toString(),
      startDate: fromDate.toLocaleString(),
      endDate: toDate.toLocaleString(),
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),
    };

    try {
      const response = (await this.subscripeService.Search(filter)) as any;
      if (response?.data) {
        this.data = response.data;
        this.totalRecords = response.totalRecords ?? response.data.length;
      }
    } catch (error) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Failed to load data');
    } finally {
      this.loading = false;
    }
  }



  retrieveCompanyServiceLabel(row: SubscriptionResponse): string {
    const companyServiceUUID = row.companyServiceIDFK?.trim();
    return this.companyServices[companyServiceUUID] || '-';
  }



  async retrieveCompanyService() {
    const filter = {
      uuid: '',
      companyIDFK: '',
      serviceIDFK: '',
      includeCompany: '1',
      includeService: '1',
      pageIndex: '0',
      pageSize: '10'
    };

    const response = await this.provisionedService.Search(filter) as any;
    const companyService = response?.data || [];
    this.companies = response.data

    this.companyServices = {};

    const lang = this.layoutService.config.lang || 'en';

    await this.ReWriteCompanyService();
  }




  Search() {
    this.FillData();
  }

  OnChange() {
    if (this.isResetting) return;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);
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


  openAddService(row: SubscriptionResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.subscripeService.SelectedData = row;

    let content = row == null ? 'Create_Subscripe' : 'Update_Subscripe';
    this.translate.get(content).subscribe((res: string) => {
      content = res;
    });

    const component = this.layoutService.OpenDialog(AddSubscripeComponent, content);
    this.subscripeService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }

  openRenew(row: SubscriptionResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.subscripeService.SelectedData = row

    let content = 'Renew_Company';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(RenewComponent, content);

    this.companyService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }

  async confirmDelete(row: SubscriptionResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.subscripeService.Delete(row.uuid!) as any;
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

  ReWriteCompanyService(): any {

    var clientDTO: any[] = []

    this.companies.map(com => {
      const comtranslation = com.company.companyTranslation?.[this.layoutService.config.lang] as any;
      const sertranslation = com.service.serviceTranslation?.[this.layoutService.config.lang] as any;

      const comp = comtranslation?.name;
      const service = sertranslation?.name;

      var obj =
      {
        ...com,
        fullName: `${comp} - ${service}`.trim()

      }

      clientDTO.push(obj)

    })

    this.companies = clientDTO;

  }
}
