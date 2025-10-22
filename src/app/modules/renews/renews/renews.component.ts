import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { RenewRequest, RenewResponse, RenewSearchRequest } from '../renews.module';
import { RenewService } from 'src/app/Core/services/renew.service';
import { RenewComponent } from '../../subscription/renew/renew.component';
import { ConstantResponse, ConstantService } from 'src/app/Core/services/constant.service';

@Component({
  selector: 'app-renews',
  templateUrl: './renews.component.html',
  styleUrls: ['./renews.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class RenewsComponent implements OnInit {
    dataForm!: FormGroup;
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    statusList: ConstantResponse[] = [];
    visible: boolean = false;
    durationTypeList: ConstantResponse[] = [];
    loading = false;
    isResetting: boolean = false;
    doneTypingInterval = 1000;
    typingTimer: any;
    data: RenewResponse[] = [];
  
    constructor(
      public formBuilder: FormBuilder,
      public translate: TranslateService,
      public layoutService: LayoutService,
      public messageService: MessageService,
      public confirmationService: ConfirmationService,
      public renewService :RenewService,
      public constantService: ConstantService,
    ) {
      this.dataForm = this.formBuilder.group({
      com_name: [''],
      startDate: ['', ],
      endDate: ['', ],
      type_period:['']
      
  });

    }
  
    async ngOnInit() {
      await this.FillData();
       const durationTypeResponse = await this.constantService.Search('DurationType') as any;
      this.durationTypeList = durationTypeResponse.data;
    }

     Search() {
      this.FillData();
    }
  
    async FillData(pageIndex: number = 0) {
      this.loading = true;
      this.data = [];
      this.totalRecords = 0;
 
     let filter: RenewSearchRequest =
      {
        uuid: '',
        subscriptionIDFK: '',
        companyServiceIDFK: '',
        durationValue: '',
        durationType:this.dataForm.controls['type_period'].value ?? '',
        FromDate: this.dataForm.controls['startDate'].value
                   ? new Date(this.dataForm.controls['startDate'].value).toISOString().split('T')[0]
                   : '',
        ToDate: this.dataForm.controls['endDate'].value
                ? new Date(this.dataForm.controls['endDate'].value).toISOString().split('T')[0]
                : '',
        companyName: this.dataForm.controls['com_name'].value,
        pageIndex: pageIndex.toString(),
        pageSize: this.pageSize.toString()
      }
  try {
      const response = (await this.renewService.Search(filter)) as any;
      console.log('response',response)
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
       console.log(this.dataForm.value);
      if (this.isResetting) { return }; 
       
  
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.FillData();
      }, this.doneTypingInterval);
  
    }
  
    showDialog(link: string) {
      
      this.visible = true;
    }
    openDialog(row:RenewResponse | null =null){
    

       window.scrollTo({ top: 0, behavior: 'smooth' });
          document.body.style.overflow = 'hidden';
          this.renewService.SelectedData = row;
      
          let content = row == null ? 'Create_Renew' : 'Update_Renew';
          this.translate.get(content).subscribe((res: string) => {
            content = res;
          });
      
          const component = this.layoutService.OpenDialog(RenewComponent,content);
          this.renewService.Dialog = component;
      
          component.OnClose.subscribe(() => {
            document.body.style.overflow = '';
            this.renewService.SelectedData=null;
            this.FillData();
          });

    }
 
    
 


}
