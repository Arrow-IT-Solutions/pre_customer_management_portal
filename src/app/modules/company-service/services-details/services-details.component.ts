import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { ProvisionedServiceResponse } from '../../wizard-to-add/wizard-to-add.module';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EncryptionService } from 'src/app/shared/service/encryption.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ServicesDetailsComponent implements OnInit {
  displayDialog = false;
  selectedEnvIndex: number | null = null;
  enteredKey = '';
  unlockedEnvs: Set<number> = new Set();
  selectedField: 'password' | 'connectionString' | null = null;
  selectedEnv: any;
  loading: boolean = false;
  searchFrom!: FormGroup;
  dataFrom!: FormGroup;
  data: ProvisionedServiceResponse;
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  companyserviceUUID: string = '';
  envDatabase: any[] = [];
  lang: string = 'en';
  constructor(
    public formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public provisionedService: ProvisionedService,
    public layoutService: LayoutService,
    public translate: TranslateService,
    private encryptionService: EncryptionService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,

  ) {

    this.searchFrom = this.formBuilder.group({
      EnvName: [''],
      server: [''],
      dbName: ['']
    });
  }

  async ngOnInit() {
    this.loading = true;
    // console.log('selecteddata', this.provisionedService.selectedData)

    await this.viewData()

    this.loading = false
  }

  async viewData() {
    try {
      if (this.provisionedService.selectedData) {
        this.data = this.provisionedService.selectedData;
        this.envDatabase = this.data.databases || [];

        for (const env of this.envDatabase) {
          env.password = env.password ? await this.decrypt(env.password) : '';
          env.connectionString = env.connectionString ? await this.decrypt(env.connectionString) : '';
        }
      } else {

        this.envDatabase = [];
      }

      this.loading = false;
    } catch (err) {
      console.error('Failed to fetch service details', err);
      this.loading = false;
    }
  }



  OnChange() {
    this.viewData();
  }

  resetSearchForm() {
    this.searchFrom.reset();
  }

  async paginate(event: any) {
    this.pageSize = event.rows;
    this.first = event.first;
    const pageIndex = event.first / event.rows;

  }
  formatDate = (rawDate: string | undefined | null): string => {
    if (!rawDate) return '';
    const date = new Date(rawDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };


  private async decrypt(encrypted: string): Promise<string> {
    try {
      return await EncryptionService.decrypt(encrypted);
    } catch (err) {
      console.warn('Decryption failed:', err);
      return '[decryption failed]';
    }
  }

  unlock(index: number, env: any) {
    this.selectedEnvIndex = index;
    this.selectedEnv = env;
    this.enteredKey = '';
    this.displayDialog = true;
  }

  validateKey() {
    const validKey = EncryptionService.base64Key; // since static

    if (this.enteredKey === validKey && this.selectedEnvIndex !== null) {
      this.unlockedEnvs.add(this.selectedEnvIndex);
      this.displayDialog = false;
      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: 'Unlocked',
        detail: `Environment #${this.selectedEnvIndex + 1} unlocked successfully.`
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

  
openAlertModel(){
  // this.alertModal.showAlert();
  console.log("alert")
  //console.log("alertModal",this.alertModal)
}



}
