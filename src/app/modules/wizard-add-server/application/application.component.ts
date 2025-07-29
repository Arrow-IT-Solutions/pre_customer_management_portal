import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ApplicationRequest } from '../../applications/application.module';
import { TranslateService } from '@ngx-translate/core';
import { ProvisionedServerRequest } from '../../servers/servers.module';
import { EncryptionService } from 'src/app/shared/service/encryption.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ApplicationSearchRequest } from '../../applications/application.module';
import { ApplicationService } from 'src/app/layout/service/applications.service';
import { WizardStep } from 'src/app/shared/models/wizrd-step';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, WizardStep {
  dataForm!: FormGroup;
  searchForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  isPasswordVisible: boolean = false;
  isEditingApp: boolean = false;
  editingAppIndex: number = -1;
  applications: ApplicationRequest[] = [];
  isEditMode: boolean = false;
  deltedApps: string[];

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public translate: TranslateService,
    public serverService: ServersService,
    public applicationService: ApplicationService,
  ) {
    this.dataForm = formBuilder.group({
      appName: ['', Validators.required],
      port: ['', Validators.required],
      url: ['', Validators.required],
      userName: [''],
      password: [''],
    });

    this.searchForm = formBuilder.group({
      searchAppName: [''],
      searchPort: [''],
    })
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    // 1) If we’re editing an existing server that already has apps, take those first:

    if (this.serverService.SelectedData) {
      this.FillApps(this.serverService.SelectedData.uuid);
    }


    const helperApps = this.serverService.serverHelper?.applications;
    if (helperApps?.length) {
      this.applications = [...helperApps];
    }
    // 2) Otherwise, see if there’s a draft in sessionStorage:
    else {
      const raw = sessionStorage.getItem('wizardApps');
      if (raw) {
        try {
          this.applications = JSON.parse(raw);
        } catch { /* ignore bad JSON */ }
      }
    }
  }

  validate(): boolean {
    // if you had per‑app form validation, do it here.
    // for now, always allow moving back to Server step:
    return true;
  }

  saveData(): void {
    // flush current array into the shared helper
    if (this.serverService.serverHelper) {
      this.serverService.serverHelper.applications = this.applications;
    }
    sessionStorage.setItem('wizardApps', JSON.stringify(this.applications));
  }

  loadData(): void {
    // retrieve the apps the ServerData step stored
    this.applications =
      this.serverService.serverHelper?.applications || [];
  }

  async FillApps(uuid: string = '') {

    const filter: ApplicationSearchRequest = {
      portNumber: '',
      name: '',
      serverIDFK: uuid,
      includeServer: '0',
      pageIndex: '0',
      pageSize: '10'
    };
    const response = (await this.applicationService.Search(filter)) as any;
    const encryptedData = response?.data || [];
    this.applications = await this.decrypt(encryptedData);

  }

  async onSubmit() {
    try {
      this.btnLoading = true;
      this.loading = true;

      await this.Save();

    } catch (exceptionVar) {
      this.btnLoading = false;
      this.loading = false;
    }
    this.loading = false;
  }

  OnChange() {

  }

  async Save() {

    let response;

    const encryptedApps = await this.encryptApplications(this.applications);
    if (this.serverService.serverHelper?.password) {
      let encryptedPassword = await EncryptionService.encrypt(this.serverService.serverHelper?.password)

      this.serverService.serverHelper.password = encryptedPassword

    }



    if (this.serverService.serverHelper) {
      this.serverService.serverHelper.applications = encryptedApps;

      console.log('req', this.serverService.serverHelper)

      response = await this.serverService.AddProvisioned(this.serverService.serverHelper);
    }


    if (response?.requestStatus?.toString() == '200') {
      const successMessage = this.isEditMode ?
        this.translate.instant('Provisioned service updated successfully') :
        response?.requestMessage;

      this.layoutService.showSuccess(this.messageService, 'toast', true, successMessage);

      setTimeout(() => {
        this.applications = [];
        this.resetForm();
        this.serverService.finish();
        this.router.navigate(['layout-admin/servers']);
        this.btnLoading = false;
      }, 500);
    } else {
      const errorMessage = response?.requestMessage

      if (response?.errors && Array.isArray(response.errors)) {
        response.errors.forEach((error: any, index: number) => {
          setTimeout(() => {
            this.layoutService.showError(this.messageService, 'toast', true,
              `${error.title || 'Error'}: ${error.traceId || error.detail || error}`);
          }, index * 1000);
        });
      } else {
        this.layoutService.showError(this.messageService, 'toast', true, errorMessage);
      }

      this.btnLoading = false;
    }

  }

  resetForm() {

  }

  resetSearchForm() {

  }

  clearForm() {
    this.loading = true;

    this.dataForm.reset();

    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  addApplication() {
    if (this.dataForm.invalid) {
      this.submitted = true;
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      return;
    }

    if (this.isEditingApp) {
      this.saveAppEdit();
      return;
    }

    var addApplication: ApplicationRequest = {
      uuid: '',
      serverIDFK: '',
      userName: this.dataForm.controls['userName'].value.toString(),
      name: this.dataForm.controls['appName'].value.toString(),
      portNumber: this.dataForm.controls['port'].value.toString(),
      url: this.dataForm.controls['url'].value.toString(),
      password: this.dataForm.controls['password'].value.toString(),
    }

    this.applications.push(addApplication);
    this.updateSession();
    this.clearForm();
    this.submitted = false;

    this.layoutService.showSuccess(this.messageService, 'toast', true, this.translate.instant('Application added successfully'));

  }

  cancelAppEdit() {
    this.isEditingApp = false;
    this.editingAppIndex = -1;
    this.clearForm();
    this.submitted = false;
  }

  saveAppEdit() {

    if (this.dataForm.invalid) {
      this.submitted = true;
      return;
    }

    const updatedApp: ApplicationRequest = {
      uuid: this.applications[this.editingAppIndex].uuid != '' ? this.applications[this.editingAppIndex].uuid : '',
      serverIDFK: '',
      userName: this.dataForm.controls['userName'].value.toString(),
      name: this.dataForm.controls['appName'].value.toString(),
      portNumber: this.dataForm.controls['port'].value.toString(),
      url: this.dataForm.controls['url'].value.toString(),
      password: this.dataForm.controls['password'].value.toString(),
    };

    this.applications[this.editingAppIndex] = updatedApp;

    this.cancelAppEdit();

    this.layoutService.showSuccess(this.messageService, 'toast', true, this.translate.instant('App updated successfully'));
  }

  async editApp(index: number) {
    this.isEditingApp = true;
    this.editingAppIndex = index;

    const apptoEdit = this.applications[index];

    let temp = {
      appName: apptoEdit.name,
      port: apptoEdit.portNumber,
      url: apptoEdit.url,
      userName: apptoEdit.userName,
      password: apptoEdit.password,
    };
    this.dataForm.patchValue(temp);

    setTimeout(() => {
      document.querySelector('.box-shadow')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  removeApp(index: number) {
    const [removed] = this.applications.splice(index, 1);

    // 2) if it had a uuid, track it for deletion
    const helper = this.serverService.serverHelper;
    if (helper && removed.uuid) {
      // ensure the array exists
      helper.deletedApps = helper.deletedApps || [];
      helper.deletedApps.push(removed.uuid);
    }


  }

  private async encryptApplications(data: ApplicationRequest[]): Promise<ApplicationRequest[]> {
    return await Promise.all(
      data.map(async (item) => {
        try {
          const encryptedPassword = await EncryptionService.encrypt(item.password);

          return {
            ...item,
            password: encryptedPassword,
          };
        } catch (err) {
          return item;
        }
      })
    );
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

  private updateSession() {

    sessionStorage.setItem('wizardApps', JSON.stringify(this.applications));

    if (this.serverService.serverHelper) {
      this.serverService.serverHelper.applications = [...this.applications];
    }
  }

  finish() {
    sessionStorage.removeItem('wizardServer');
    sessionStorage.removeItem('wizardApps');
    this.serverService.SelectedData = null;
    this.serverService.serverHelper = null;
  }

}
