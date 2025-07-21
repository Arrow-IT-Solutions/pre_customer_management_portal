import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ServiceSearchRequest,
  ServiceResponse,
  ServiceTranslationResponse
} from '../services.module';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddServiceComponent } from '../add-service/add-service.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ServicesService } from 'src/app/Core/services/services.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ServicesComponent {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  visible: boolean = false;
  link = '';

  dataForm!: FormGroup;
  data: ServiceResponse[] = [];
  
  loading = false;
  isResetting: boolean = false;

  doneTypingInterval = 1000;
  typingTimer: any;

  constructor(
    public formBuilder: FormBuilder,
    public serviceService: ServicesService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {
    this.dataForm = this.formBuilder.group({
    name: [''],
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    description: ['', Validators.required]
});
 this.serviceService.refreshServices$.subscribe(() => {
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

    const filter: ServiceSearchRequest = {
      name: this.dataForm.get('name')?.value?.trim(),
      uuid: this.dataForm.get('uuid')?.value?.trim(),
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),
    };

    const response = (await this.serviceService.Search(filter)) as any;

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

  

 openAddService(row: ServiceResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.serviceService.SelectedData = row;

    let content = row == null ? 'Create_Service' : 'Update_Service';
    this.translate.get(content).subscribe((res: string) => {
      content = res;
    });

    const component = this.layoutService.OpenDialog(AddServiceComponent, content);
    this.serviceService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }

async confirmDelete(row: ServiceResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.serviceService.Delete(row.uuid!) as any;
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
    this.link = link;
    this.visible = true;
  }


}
