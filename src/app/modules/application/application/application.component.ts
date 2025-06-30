import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SettingsService } from 'src/app/layout/service/settings.service';
import { SettingResponse, SettingSearchRequest } from '../../settings/settings.module';
import { MatDialog } from '@angular/material/dialog';
import { QRCodeDialogComponent } from '../../QR/qrcode-dialog/qrcode-dialog.component';
import { ApplicationResponse, ApplicationSearchRequest } from '../application.module';
import { AddApplicationComponent } from '../add-application/add-application.component';
import { ApplicationService } from 'src/app/layout/service/application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ApplicationComponent {
  dataForm!: FormGroup;
  loading = false;
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  data: ApplicationResponse[] = [];
  formTotal: number = 0;
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  appURL: string = '';
  setting: SettingResponse;
  link = '';
  visible: boolean = false;
  constructor(public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public translate: TranslateService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public applicationService: ApplicationService,
    public settingService: SettingsService,
    private dialog: MatDialog
  ) {
    this.dataForm = this.formBuilder.group({
      name: [''],

    })

    this.applicationService.refreshApplications$.subscribe(() => {
      this.FillData();
    });
  }

  async ngOnInit() {
    await this.FillData();
  }

  async RetriveSettings() {


    let filter: SettingSearchRequest = {

      name: '',
      uuid: '',
      pageIndex: "",
      pageSize: '100000'

    }
    const response = await this.settingService.Search(filter) as any

    this.setting = response.data[0];
    this.appURL = this.setting.appURL;

  }
  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.formTotal = 0;
    let filter: ApplicationSearchRequest = {
      uuid: '',
      name: this.dataForm.controls['name'].value,
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),
    };

    const response = (await this.applicationService.Search(filter)) as any;
    console.log('data', response)
    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.formTotal = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.formTotal = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;

  }
  openAddForm(row: ApplicationResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.applicationService.SelectedData = row
    let content = this.applicationService.SelectedData == null ? 'Create_App' : 'Update_App';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(AddApplicationComponent, content);
    this.applicationService.Dialog = component;
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
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
    if (this.isResetting) { return };

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);
  }

  confirmDelete(row: ApplicationResponse) {

    console.log(row)
    this.confirmationService.confirm({
      message: this.translate.instant("Do_you_want_to_delete_this_record?"),
      header: this.translate.instant("Delete_Confirmation"),
      icon: 'pi pi-info-circle',
      key: 'positionDialog',
      closeOnEscape: true,
      accept: async () => {
        const response = (await this.applicationService.Delete(row.uuid!)) as any;

        if (response?.requestStatus?.toString() == '200') {
          this.confirmationService.close();
          this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);
          this.FillData();
        }
        else {
          this.confirmationService.close();
          this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
        }



      },
      reject: () => { },
    });
  }

  CopyLink(row: ApplicationResponse | null = null) {
    if (!row) {
      return;
    }

    // const linkToCopy = `${this.appURL}/#/forms/${row.uuid}`;
    // const linkToCopy = `${this.appURL}/#/application/${row.uuid}`;
    //const linkToCopy = `${this.appURL}`;
    const linkToCopy = `${row.url}`;
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        console.log('Copied to clipboard:', linkToCopy);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  }

  OpenQRDialog(row: ApplicationResponse) {
    if (!row) {
      return;
    }
    this.applicationService.SelectedData = row;
    // const linkToCopy = `${this.appURL}/#/forms/${row.uuid}`;
    const linkToCopy = `${this.appURL}/#/application/${row.uuid}`;
    // const linkToCopy = `${this.appURL}`;
    this.dialog.open(QRCodeDialogComponent, {
      data: linkToCopy,
      width: '300px',       // desired width
      maxWidth: '90vw',     // never overflow the viewport
      height: '500px',       // let it grow vertically as needed
      panelClass: 'qr-dialog' // optional: for any extra styling
    });
  }

  showDialog(link: string) {
    this.link = link;
    this.visible = true;
  }

}
