import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { customerServiceResponse } from '../customer-service.module';
import { customerServiceService } from 'src/app/layout/service/customerService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-services',
  templateUrl: './customer-services.component.html',
  styleUrls: ['./customer-services.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CustomerServicesComponent {
    dataForm!: FormGroup;
    loading = false;
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    data: customerServiceResponse[] = [];
    statusList: ConstantResponse[] = [];
    doneTypingInterval = 1000;
    typingTimer: any;
    isResetting: boolean = false;
  
    constructor(
      public formBuilder: FormBuilder,
      public layoutService: LayoutService,
      public translate: TranslateService,
      public constantService: ConstantService,
      public customerService: customerServiceService,
      public messageService: MessageService,
      public confirmationService: ConfirmationService,
      public route:Router
    ) {
      this.dataForm = this.formBuilder.group({
        customerName: [''],
        service:['']
      });
  
    }
  
    async ngOnInit() {
      await this.FillData();
     ;
    }
  
    async FillData(pageIndex: number = 0) {
      this.loading = true;
      this.data = [];
      this.totalRecords = 0;
  
       
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
    this.pageSize = event.rows;
    this.first = event.first;
    const pageIndex = event.first / event.rows;  
    this.FillData(pageIndex);
  }
  
  
    openAddService() {
      this.route.navigate(['layout-admin/add/customer-service'])
    }
  
    async confirmDelete(row: customerServiceResponse) {
        this.confirmationService.confirm({
          message: this.translate.instant('Do_you_want_to_delete_this_record?'),
          header: this.translate.instant('Delete_Confirmation'),
          icon: 'pi pi-info-circle',
          acceptLabel: this.translate.instant('Yes'),
          rejectLabel: this.translate.instant('No'),
          key: 'confirmDialog',
          accept: async () => {
            try {
              // const resp = await this.customerService.Delete(row.uuid!) as any;
              // this.layoutService.showSuccess(this.messageService, 'toast', true, resp?.requestMessage || 'Deleted');
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

}
