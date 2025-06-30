import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { SettingResponse, SettingSearchRequest } from '../settings.module';
import { SettingsService } from 'src/app/layout/service/settings.service';
import { AddSettingComponent } from '../add-setting/add-setting.component';
import { MatDialog } from '@angular/material/dialog';
import { QRCodeDialogComponent } from '../../QR/qrcode-dialog/qrcode-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SettingsComponent {
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  totalRecords: number = 0;
  pageSize: number = 12;
  first: number = 0;
  loading = false;
  visible: boolean = false;
  data: SettingResponse[] = [];
  link = '';
  constructor(public route: Router,
    public settingService: SettingsService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public translate: TranslateService,
    private dialog: MatDialog) { }
  OnChange() {
    if (this.isResetting) { return }; // Do nothing if resetting

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);

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
    let filter: SettingSearchRequest = {
      uuid: '',
      name: '',
    };

    const response = (await this.settingService.Search(filter)) as any;

    console.log(response)

    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.totalRecords = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      console.log(this.data)
      this.totalRecords = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;
  }
  async resetform() {
    this.isResetting = true;
    await this.FillData();
    this.isResetting = false;
  }
  paginate(event: any) {
    this.pageSize = event.rows
    this.first = event.first
    this.FillData(event.first)

  }
  openDialog(row: SettingResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    let content = this.settingService.SelectedData == null ? 'Setting_Create' : 'Update_Setting';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(AddSettingComponent, content);
    this.settingService.Dialog = component;
    this.settingService.SelectedData = row
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }


  confirmDelete(row: SettingResponse) {

    console.log(row)
    this.confirmationService.confirm({
      message: "Do_you_want_to_delete_this_record?",
      header: "Delete_Confirmation",
      icon: 'pi pi-info-circle',
      key: 'positionDialog',
      closeOnEscape: true,
      accept: async () => {
        const response = (await this.settingService.Delete(row.uuid!)) as any;

        this.confirmationService.close();

        this.layoutService.showSuccess(this.messageService, 'toste', true, response.requestMessage);

        this.FillData();

      },
      reject: () => {
        // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      },
    });
  }

  showDialog(link: string) {
    this.link = link;
    this.visible = true;
  }

  OpenQRDialog(row: SettingResponse) {
    if (!row) {
      return;
    }
    this.settingService.SelectedData = row;
    const linkToCopy = row.appURL;
    this.dialog.open(QRCodeDialogComponent, {
      data: linkToCopy,
      width: '300px',
      maxWidth: '90vw',
      height: '500px',
      panelClass: 'qr-dialog'
    });
  }
}
