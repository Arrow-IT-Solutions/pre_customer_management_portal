import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from 'src/app/layout/service/applications.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ApplicationResponse, ApplicationSearchRequest } from '../../applications/application.module';
import { ServerResponse } from '../servers.module';
import { EncryptionService } from 'src/app/shared/service/encryption.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-server-detailes',
  templateUrl: './server-detailes.component.html',
  styleUrls: ['./server-detailes.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class ServerDetailesComponent {
  showDecrypted = false;
  displayDialog = false;
  enteredKey = '';
  loading: boolean = false;
  searchFrom!: FormGroup;
  dataFrom!: FormGroup;
  data: ServerResponse;
  pageSize: number = 12;
  first: number = 0;
  apps: ApplicationResponse[];
  totalRecords: number = 0;
  decryptedPass: string | null = '';
  constructor(
    public formBuilder: FormBuilder,
    public serverService: ServersService,
    public applicationService: ApplicationService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
  ) {
    this.searchFrom = this.formBuilder.group({
      AppName: [''],
      port: [''],
    })

  }
  async ngOnInit() {
    await this.FillData();
  }

  OnChange() {

  }

  async FillData() {

    if (this.serverService.ServerDetails) {
      this.data = this.serverService.ServerDetails
      this.decryptedPass = await EncryptionService.decrypt(this.serverService.ServerDetails.password)
    }

    this.loading = true;
    const filter: ApplicationSearchRequest = {
      serverIDFK: this.serverService.SelectedData?.uuid,
      includeServer: "1",
      pageSize: '2'
    };

    const response = await this.applicationService.Search(filter)
    this.apps = await this.decrypt(response.data);
    this.totalRecords = this.apps.length

    this.loading = false;
  }

  resetSearchForm() {
    this.searchFrom.reset();
    this.FillApps();
  }

  async paginate(event: any) {
    this.pageSize = event.rows;
    this.first = event.first;
    const pageIndex = event.first / event.rows;

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

  async FillApps() {
    this.loading = true;
    const filter: ApplicationSearchRequest = {
      serverIDFK: this.serverService.SelectedData?.uuid,
      name: this.searchFrom.controls['AppName'].value,
      portNumber: this.searchFrom.controls['port'].value,
      includeServer: "1",
      pageSize: '2'
    };

    const response = await this.applicationService.Search(filter)
    this.apps = await this.decrypt(response.data);
    this.totalRecords = this.apps.length;
    this.loading=false;
  }
   lock(){
    this.showDecrypted=false;
   }
  unlockPassword() {
    this.enteredKey = '';
    this.displayDialog = true;
  }

  Lock() {
    this.showDecrypted = false;
  }

  validateKey() {
    const validKey = EncryptionService.base64Key; // since your service uses static members

    if (this.enteredKey === validKey) {
      this.showDecrypted = true;
      this.displayDialog = false;

      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: 'Unlocked',
        detail: 'Decrypted successfully.'
      });
    } else {
      this.messageService.add({
        key: 'toast',
        severity: 'error',
        summary: 'Invalid Key',
        detail: 'The provided key is incorrect.'
      });
    }
  }
}
