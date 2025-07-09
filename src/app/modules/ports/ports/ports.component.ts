import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { PortService } from 'src/app/layout/service/ports.service';
import { AddPortComponent } from '../add-port/add-port.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PortResponse, PortSearchRequest } from '../port.module';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-ports',
  templateUrl: './ports.component.html',
  styleUrls: ['./ports.component.scss']
})
export class PortsComponent implements OnInit{
  dataForm!: FormGroup;
  loading = false;
  pageSize = 12;
  first = 0;
  totalRecords = 0;
  data: PortResponse[] = [];
  typingTimer: any;
  doneTypingInterval = 1000;
  isResetting = false;
  formChangesSub!: Subscription;


    constructor(
      public formBuilder:FormBuilder,
      public layoutService: LayoutService,
      public translate: TranslateService,
      public portService:PortService,
      public confirmationService: ConfirmationService,
      public messageService: MessageService,
    ) {
      this.dataForm=this.formBuilder.group({
        portNumber:[''],
      })
    }
  
  async fillData(pageIndex: number = 0) {
     this.first = pageIndex * this.pageSize;
     this.loading = true;
 

     const filter: PortSearchRequest = {
       portNumber: this.dataForm.get('portNumber')?.value || '',
       pageIndex: pageIndex.toString(),
       pageSize: this.pageSize.toString()
     };
 
     try {
       const response = await this.portService.Search(filter) as any;
       this.data = [...(response?.data || [])];
       this.totalRecords = Number(response?.totalRecords || 0);
     } catch {
       this.messageService.add({
         severity: 'error',
         summary: this.translate.instant('Error'),
         detail: this.translate.instant('Failed to load ports')
       });
     }
 
     this.loading = false;
   }
  
   async ngOnInit() {
     await this.fillData(0);
     this.formChangesSub = this.dataForm.valueChanges
       .pipe(
         debounceTime(this.doneTypingInterval),
         distinctUntilChanged(),
         filter(() => !this.isResetting)
       )
       .subscribe(() => this.fillData(0));
   }
  
  
  async resetForm() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.fillData(0);
    this.isResetting = false;
  }


  OnChange() {
    if (this.isResetting) return;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.fillData(0);
    }, this.doneTypingInterval);
  }


  paginate(event: any) {
    this.first = event.first;
    this.pageSize = event.rows;
    const pageIndex = Math.floor(event.first / event.rows);
    console.log('pageIndex:', pageIndex, 'first:', this.first, 'pageSize:', this.pageSize);
    this.fillData(pageIndex);
  }

  openDialog(row: PortResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.portService.SelectedData = row;

    let content = row ? 'Update_port' : 'Create_port';
    this.translate.get(content).subscribe(res => content = res);

    const comp = this.layoutService.OpenDialog(AddPortComponent, content);
    this.portService.Dialog = comp;
    comp.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.fillData(Math.floor(this.first / this.pageSize));
    });
  }

    openAddport(){
       window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      let content = this.portService.SelectedData == null ? 'Create_port' : 'Update_port';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
      var component = this.layoutService.OpenDialog(AddPortComponent, content);
      this.portService.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.fillData();
      });
    }
      async confirmDelete(row: PortResponse) {
        this.confirmationService.confirm({
          message: this.translate.instant('port.Do_you_want_to_delete_this_record?'),
          header: this.translate.instant('Delete_Confirmation'),
          icon: 'pi pi-info-circle',
          acceptLabel: this.translate.instant('Yes'),
          rejectLabel: this.translate.instant('No'),
          key: 'confirmDialog',
          accept: async () => {
            try {
              const resp = await this.portService.Delete(row.uuid!) as any;
              this.layoutService.showSuccess(this.messageService, 'toast', true, resp?.requestMessage || 'Deleted');
              this.fillData(Math.floor(this.first / this.pageSize));
            } catch (error) {
              this.messageService.add({
                severity: 'error',
                summary: this.translate.instant('Error'),
                detail: this.translate.instant('port.Failed_to_delete')
              });
            }
          }
        });
      }
}
