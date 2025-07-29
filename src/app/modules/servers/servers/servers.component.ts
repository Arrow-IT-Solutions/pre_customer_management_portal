import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ServerSearchRequest,
  ServerResponse
} from '../servers.module';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddServerComponent } from '../add-server/add-server.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ServersService } from 'src/app/layout/service/servers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ServersComponent {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  visible: boolean = false;
  link = '';

  dataForm!: FormGroup;
  data: ServerResponse[] = [];

  loading = false;
  isResetting: boolean = false;

  doneTypingInterval = 1000;
  typingTimer: any;

  constructor(
    public formBuilder: FormBuilder,
    public serverService: ServersService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public route:Router
  ) {
    this.dataForm = this.formBuilder.group({
      hostname: [''],
      ipaddress: ['']
    });
    this.serverService.refreshServers$.subscribe(() => {
      this.FillData();
    });
  }

  async ngOnInit() {
    await this.FillData();
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];

    const filter: ServerSearchRequest = {
      uuid: '',
      hostname: this.dataForm.controls['hostname'].value,
      ipAddress: this.dataForm.controls['ipaddress'].value,
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    const response = await this.serverService.Search(filter) as any;

    this.data = response?.data || [];
    this.totalRecords = Number(response?.totalRecords || 0);
    this.loading = false;
  }

  openAddServer(row: ServerResponse | null = null) {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    // document.body.style.overflow = 'hidden';
    // this.serverService.SelectedData = row;

    // let content = row == null ? 'Create_Server' : 'Update_Server';
    // this.translate.get(content).subscribe((res: string) => {
    //   content = res;
    // });

    // const component = this.layoutService.OpenDialog(AddServerComponent, content);
    // this.serverService.Dialog = component;

    // component.OnClose.subscribe(() => {
    //   document.body.style.overflow = '';
    //   this.FillData();
    // });
  this.route.navigate(['layout-admin/add-server/server-data'])
  }

  async confirmDelete(row: ServerResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.serverService.Delete(row.uuid!) as any;
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
    this.FillData(event.first);
  }

  OnChange() {
    if (this.isResetting) return;

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);
  }

  showDialog(link: string) {
    this.link = link;
    this.visible = true;
  }

  viewDetails(server: ServerResponse){
    this.serverService.SelectedData = server;
    console.log('Selected Server', server)
    this.route.navigate(['layout-admin/servers/server-details']);
  }
}
