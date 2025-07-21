import { Component, OnInit } from '@angular/core';
import { AddCredentialComponent } from '../add-credential/add-credential.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { CredentialService } from 'src/app/layout/service/credential.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CredentialResponse, CredentialSearchRequest } from '../credential.module';
import { PortService } from 'src/app/layout/service/ports.service';
import { EncryptionService } from 'src/app/shared/service/encryption.service';

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.scss']
})
export class CredentialComponent implements OnInit {
  dataForm!: FormGroup;
  loading = false;
  pageSize = 12;
  first = 0;
  totalRecords = 0;
  data: CredentialResponse[] = [];
  typingTimer: any;
  doneTypingInterval = 1000;
  isResetting = false;
  portOptions: { uuid: string; portNumber: string }[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public translate: TranslateService,
    public credentialService: CredentialService,
    public confirmationService: ConfirmationService,
    public messageService: MessageService,
    public portService: PortService
  ) {
    this.dataForm = this.formBuilder.group({
      userName: [''],
      password: [''],
      portIDFK: ['']
    });
  }

  async fillData(pageIndex: number = 0) {
    this.first = pageIndex * this.pageSize;
    this.loading = true;

    const filter: CredentialSearchRequest = {
      userName: this.dataForm.get('userName')?.value || '',
      portIDFK: this.dataForm.get('portIDFK')?.value || '',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    try {
      const response = (await this.credentialService.Search(filter)) as any;
      const encryptedData = response?.data || [];
      this.data = await this.decrypt(encryptedData);

      this.totalRecords = Number(response?.totalRecords || 0);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Error'),
        detail: this.translate.instant('Failed to load credentials')
      });
    }

    this.loading = false;
  }

  async ngOnInit() {
    try {
      const response = await this.portService.Search({});
      this.portOptions = response.data || [];
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Error'),
        detail: this.translate.instant('Failed to load ports')
      });
    }

    await this.fillData(0);
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

  openAddcredential(row: CredentialResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.credentialService.SelectedData = row;

    let content = row ? 'Update_Credential' : 'Create_Credential';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(AddCredentialComponent, content);
    this.credentialService.Dialog = component;
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.fillData(Math.floor(this.first / this.pageSize));
    });
  }

  async confirmDelete(row: CredentialResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('credential.Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = (await this.credentialService.Delete(row.uuid!)) as any;
          this.messageService.add({
            key: 'toast',
            severity: 'success',
            summary: this.translate.instant('Success'),
            detail: this.translate.instant('Deleted_successfully')
          });
          this.fillData(Math.floor(this.first / this.pageSize));
        } catch (error) {
          this.messageService.add({
            key: 'toast',
            severity: 'error',
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
