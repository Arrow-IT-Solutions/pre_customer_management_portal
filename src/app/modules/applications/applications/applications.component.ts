import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ApplicationService } from 'src/app/layout/service/applications.service';
import { AddApplicationComponent } from '../add-application/add-application.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApplicationResponse, ApplicationSearchRequest } from '../application.module';
import { debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ServerResponse } from '../../servers/servers.module';
import { EncryptionService } from 'src/app/shared/service/encryption.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  dataForm!: FormGroup;
  loading = false;
  pageSize = 12;
  first = 0;
  totalRecords = 0;
  data: ApplicationResponse[] = [];
  typingTimer: any;
  doneTypingInterval = 1000;
  isResetting = false;
  formChangesSub!: Subscription;
  serverOptions: ServerResponse[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public translate: TranslateService,
    public applicationService: ApplicationService,
    public confirmationService: ConfirmationService,
    public messageService: MessageService,
    public serverService: ServersService
  ) {
    this.dataForm = this.formBuilder.group({
      name: [''],
      password: [''],
      userName: [''],
      portNumber: [''],
      url: [''],
      serverIDFK: ['']
    });
  }

  async fillData(pageIndex: number = 0) {
    this.first = pageIndex * this.pageSize;
    this.loading = true;

    const filter: ApplicationSearchRequest = {
      name: this.dataForm.controls['name'].value?.toString()|| '',
       portNumber:this.dataForm.controls['portNumber'].value?.toString()||'',
      serverIDFK: this.dataForm.controls['serverIDFK'].value?.toString()|| '',
      includeServer: '1',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    try {
      const response = (await this.applicationService.Search(filter)) as any;
      const encryptedData = response?.data || [];
      this.data = await this.decrypt(encryptedData);
      this.totalRecords = Number(response?.totalRecords || 0);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Error'),
        detail: this.translate.instant('Failed to load applications')
      });
    }

    this.loading = false;
  }
  async FillServers() {
    const response = await this.serverService.Search({ pageSize: "1000" });
    this.serverOptions = (response?.data || []).map((server: any) => {
      return {
        uuid: server.uuid,
        hostname: server.hostname || 'Unnamed'
      };
    });
  }
  getHostName(row: ApplicationResponse): string {
    const server = row.serverResponse;
    if (!server) return '-';

    return server.hostname || '-';
  }
  async ngOnInit() {
    this.loading = true;
    await this.FillServers();
    await this.fillData(0);

    this.loading = false;
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

  openDialog(row: ApplicationResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.applicationService.SelectedData = row;

    let content = row ? 'Update_application' : 'Create_application';
    this.translate.get(content).subscribe((res) => (content = res));

    const comp = this.layoutService.OpenDialog(AddApplicationComponent, content);
    this.applicationService.Dialog = comp;
    comp.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.fillData(Math.floor(this.first / this.pageSize));
    });
  }



  async confirmDelete(row: ApplicationResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = (await this.applicationService.Delete(row.uuid!)) as any;
          if (resp.requestStatus == '200') {
            this.messageService.add({
              key: 'toast',
              severity: 'success',
              summary: this.translate.instant('Success'),
              detail: this.translate.instant('Deleted_successfully')
            });
          }
          else if (resp.requestStatus == '400') {
            this.messageService.add({
              severity: 'error',
              key: 'toast',
              summary: this.translate.instant('Error'),
              detail: this.translate.instant('application.Failed_to_delete')
            });
          }
          this.fillData(Math.floor(this.first / this.pageSize));
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            key: 'toast',
            summary: this.translate.instant('Error'),
            detail: this.translate.instant('Failed_to_delete')
          });
        }
      }
    });
  }

  private async decrypt(data: any[]): Promise<any[]> {
    return await Promise.all(
      data.map(async (item) => {
        try {
          const decryptedPassword = await EncryptionService.decrypt(item.password);

          return { ...item, password: decryptedPassword };
        } catch (err) {
          console.warn(`Failed to decrypt password for item with id ${item.id}:`, err);
          return { ...item, password: '[decryption failed]' };
        }
      })
    );
  }
}
