import { Component, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EnvDatabase, ProvisionedServiceRequest, ProvisionedSession, ProvisionedServiceUpdateRequest } from '../wizard-to-add.module';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { ServerResponse, ServerSearchRequest } from '../../servers/servers.module';
import { TranslateService } from '@ngx-translate/core';
import { EncryptionService } from 'src/app/shared/service/encryption.service';


@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss'],
  providers: [MessageService]
})
export class EnvironmentComponent implements OnDestroy {
  @ViewChild('serverDropdown') serverDropdown!: Dropdown;
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  isPasswordVisible: boolean = false;
  servers: ServerResponse[] = [];
  private isNavigatingWithinWizard: boolean = false;
  session!: ProvisionedSession;
  envDatabase: EnvDatabase[] = [];
  private isNavigatingToCustomerService = false;
  isEditMode: boolean = false;
  editingServiceId: string | null = null;
  isEditingEnvironment: boolean = false;
  editingEnvironmentIndex: number = -1;
  private saveDataSubscription?: Subscription;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public serverService: ServersService,
    public provisionedService: ProvisionedService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef

  ) {
    this.dataForm = formBuilder.group({
      nameEnvEn: ['', Validators.required],
      nameEnvAr: ['', Validators.required],
      urlEnv: ['', Validators.required],
      server: ['', Validators.required],
      databaseName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      EnvName:['']

    });

    this.dataForm.valueChanges.pipe(
      debounceTime(300) 
    ).subscribe(() => {
      if (!this.loading) { 
        this.updateSessionWithCurrentFormData();
      }
    });

  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    try {
      this.loading = true;

      this.editingServiceId = sessionStorage.getItem('editingProvisionedServiceId');
      if (this.editingServiceId) {
        this.isEditMode = true;
      }

      await this.RetriveServer();

      try {
        this.session = this.provisionedService.getSession();

        if (this.session.envDatabases && this.session.envDatabases.length > 0) {
          this.envDatabase = [...this.session.envDatabases];
        }

        this.restoreFormFromSession();
      } catch (error) {
        console.log('No existing session found for environment');
        
        this.session = {};
        
        const savedFormData = sessionStorage.getItem('currentEnvironmentFormData');
        if (savedFormData) {
          try {
            const parsedData = JSON.parse(savedFormData);
            this.session.currentEnvironmentFormData = parsedData;
          } catch (parseError) {
            console.log('Failed to parse saved environment data');
          }
        }
        
        const savedSessionData = sessionStorage.getItem('provisionedSessionData');
        if (savedSessionData) {
          try {
            const parsedSessionData = JSON.parse(savedSessionData);
            this.session = { ...this.session, ...parsedSessionData };
          } catch (parseError) {
            console.log('Failed to parse saved session data');
          }
        }
        
        this.provisionedService.setSession(this.session);
        
        this.restoreFormFromSession();
      }

      this.resetForm();

      this.saveDataSubscription = this.provisionedService.saveEnvironmentData$.subscribe(() => {
        this.handleSaveDataEvent();
      });

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  private handleSaveDataEvent() {
    try {
      this.updateSessionWithCurrentFormData();
    } catch (error) {
      console.log('Environment: Error saving form data:', error);
    }
  }

  private restoreFormFromSession() {
    if (this.session?.currentEnvironmentFormData) {
      const formData = this.session.currentEnvironmentFormData;

      this.loading = true;

      this.dataForm.patchValue({
        nameEnvEn: formData.nameEnvEn || '',
        nameEnvAr: formData.nameEnvAr || '',
        urlEnv: formData.urlEnv || '',
        server: formData.server || '',
        databaseName: formData.databaseName || '',
        userName: formData.userName || '',
        password: formData.password || ''
      });

      setTimeout(() => {
        this.loading = false;
      }, 100);

    }
  }

  private updateSessionWithCurrentFormData() {
    if (this.loading || !this.dataForm) {
      console.log('Environment: Skipping save - form not ready or loading');
      return;
    }

    try {
      this.session = this.provisionedService.getSession();
    } catch (error) {
      console.log('Environment: Creating new session for environment data');
      this.session = {};
      try {
        const savedData = sessionStorage.getItem('currentEnvironmentFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          this.session.currentEnvironmentFormData = parsedData;
        }
      } catch (parseError) {
        console.log('Environment: No saved form data to restore');
      }
    }    
    this.session.envDatabases = this.envDatabase;

    const currentFormData = {
      nameEnvEn: this.dataForm.controls['nameEnvEn'].value || '',
      nameEnvAr: this.dataForm.controls['nameEnvAr'].value || '',
      urlEnv: this.dataForm.controls['urlEnv'].value || '',
      server: this.dataForm.controls['server'].value || '',
      databaseName: this.dataForm.controls['databaseName'].value || '',
      userName: this.dataForm.controls['userName'].value || '',
      password: this.dataForm.controls['password'].value || ''
    };

    this.session.currentEnvironmentFormData = currentFormData;

    this.provisionedService.setSession(this.session);

    sessionStorage.setItem('currentEnvironmentFormData', JSON.stringify(currentFormData));
    
    const sessionDataToSave = {
      customerIDFK: this.session.customerIDFK,
      serviceIDFK: this.session.serviceIDFK,
      subscription: this.session.subscription,
      envDatabases: this.session.envDatabases,
      currentEnvironmentFormData: currentFormData
    };
    sessionStorage.setItem('provisionedSessionData', JSON.stringify(sessionDataToSave));

  }

  private clearSavedFormData() {
    try {
      if (this.session) {
        delete this.session.currentEnvironmentFormData;
        this.provisionedService.setSession(this.session);
      }
      sessionStorage.removeItem('currentEnvironmentFormData');
    } catch (error) {
      console.log('No session to clear form data from');
    }
  }
  
  async onSubmit() {
    try {
      this.btnLoading = true;
      this.loading = true;
      this.updateSessionWithCurrentFormData();

      await this.Save();

    } catch (exceptionVar) {
      this.btnLoading = false;
      this.loading = false;
    }
    this.loading = false;
  }
  OnChange() {}

  async Save() {
    if (!this.envDatabase || this.envDatabase.length === 0) {
      this.layoutService.showError(this.messageService, 'toast', true, this.translate.instant("Environment_required"));
      return;
    }

    let response;

    if (this.isEditMode && this.editingServiceId) {
      if (!this.session) {
        this.layoutService.showError(this.messageService, 'toast', true, 'Session data is missing. Please restart the process.');
        return;
      }

      const updateProvisioned: ProvisionedServiceUpdateRequest = {
        uuid: this.editingServiceId,
        customerIDFK: this.session.customerIDFK,
        serviceIDFK: this.session.serviceIDFK,
      };


      updateProvisioned.subscription = {
        customerServiceIDFK: this.session.subscription?.uuid == null ? this.editingServiceId : this.session.subscription?.uuid,
        uuid: this.session.subscription?.uuid?.toString(),
        startDate: this.session.subscription?.startDate,
        endDate: this.session.subscription?.endDate,
        price: this.session.subscription?.price,
        status: this.session.subscription?.status,
      };
      if (this.session.subscription) {

        if (this.session.subscription.uuid &&
          this.session.subscription.uuid.trim() !== '' &&
          this.session.subscription.uuid !== 'undefined' &&
          this.session.subscription.uuid !== 'null') {
          updateProvisioned.subscription.uuid = this.session.subscription.uuid.trim();
        } else {
          updateProvisioned.subscription.uuid = this.editingServiceId;
        }
      }

      const envs: EnvDatabase[] = await Promise.all(
        this.envDatabase.map(async ({
          url,
          serverIDFK,
          dbName,
          connectionString,
          dbUserName,
          dbPassword,
          environmentTranslation
        }) => {
          const [encryptedConnStr, encryptedPass] = await Promise.all([
            connectionString
              ? EncryptionService.encrypt(connectionString)
              : undefined,
            dbPassword
              ? EncryptionService.encrypt(dbPassword)
              : undefined
          ]);

          const envTranslations = Array.isArray(environmentTranslation)
            ? environmentTranslation
              .filter(et => et.name && et.language)
              .map(({ uuid, name, language }) => ({ uuid, name, language }))
            : [];

          return {
            url,
            serverIDFK: serverIDFK.toString(),
            dbName,
            connectionString: encryptedConnStr,
            dbUserName,
            dbPassword: encryptedPass,
            ...(envTranslations.length && { environmentTranslation: envTranslations })
          } as EnvDatabase;
        })
      );

      updateProvisioned.envDatabases = envs;
      response = await this.provisionedService.Update(updateProvisioned);

    } else {
      const encryptedEnvDatabases = await this.encryptEnvDatabases(this.envDatabase);

      const addProvisioned: ProvisionedServiceRequest = {
        subscription: this.session.subscription,
        customerIDFK: this.session.customerIDFK,
        serviceIDFK: this.session.serviceIDFK,
        envDatabases: encryptedEnvDatabases
      };


      response = await this.provisionedService.Add(addProvisioned);
    }
    if (response?.requestStatus?.toString() == '200') {
      const successMessage = this.isEditMode ?
        this.translate.instant('Provisioned service updated successfully') :
        response?.requestMessage;

      this.layoutService.showSuccess(this.messageService, 'toast', true, successMessage);

      setTimeout(() => {
        this.envDatabase = [];
        this.resetForm();
        this.provisionedService.clearSession();       
        this.clearAllSavedData();

        if (this.isEditMode) {
          sessionStorage.removeItem('editingProvisionedServiceId');

        } else {
          this.isNavigatingToCustomerService = true;
        }
        this.router.navigate(['layout-admin/customer-services']);
        this.btnLoading = false;
      }, 500);
    } else {
      console.error(' Error response:', response);
      const errorMessage = response?.requestMessage ||
        response?.errors ||
        'An error occurred while processing the request';

      if (response?.errors && Array.isArray(response.errors)) {
        response.errors.forEach((error: any, index: number) => {
          console.error(`Error ${index + 1}:`, error);
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

  private async encryptEnvDatabases(data: EnvDatabase[]): Promise<EnvDatabase[]> {
    return await Promise.all(
      data.map(async (item) => {
        try {
          const encryptedPassword = await EncryptionService.encrypt(item.dbPassword);
          const encryptedConnectionString = await EncryptionService.encrypt(item.connectionString);

          return {
            ...item,
            dbPassword: encryptedPassword,
            connectionString: encryptedConnectionString
          };
        } catch (err) {
          return item;
        }
      })
    );
  }

  resetForm() {
    this.loading = true;

    if (this.session?.currentEnvironmentFormData) {
      this.restoreFormFromSession();
    } else {
      this.dataForm.reset();
      setTimeout(() => {
        this.loading = false;
      }, 100);
    }
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

  back() {
    this.isNavigatingToCustomerService = true;

    this.updateSessionWithCurrentFormData();

    this.router.navigate(['layout-admin/add/customer-service'], {
      queryParams: { fromBack: 'true' }
    });
  }

  async RetriveServer() {

    var serverID: any;

    let filter: ServerSearchRequest = {

      hostname: '',
      uuid: serverID,
      pageIndex: "",
      pageSize: '10'

    }
    const response = await this.serverService.Search(filter) as any

    this.servers = response.data || [];

    await this.ReWriteServer();

  }

  ReWriteServer(): any {

    var serverDTO: any[] = []

    this.servers.map(server => {
      const serverName = server.ipAddress;

      var obj =
      {
        ...server,
        ipAddress: `${serverName}`.trim()

      }

      serverDTO.push(obj)

    })

    this.servers = serverDTO;

  }

  async FillServer(event: any = null) {

    let filterInput = '';
    if (event != null) {
      filterInput = event.filter
    }

    let filter: ServerSearchRequest = {

      hostname: '',
      ipAddress: filterInput,
      uuid: '',
      pageIndex: "",
      pageSize: '10'
    }
    const response = await this.serverService.Search(filter) as any

    this.servers = response.data
    await this.ReWriteServer();
  }

  async addEnvironment() {
    if (this.dataForm.invalid) {
      this.submitted = true;
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      return;
    }

    if (this.isEditingEnvironment) {
      this.saveEnvironmentEdit();
      return;
    }

    const serverValue = this.dataForm.controls['server'].value?.trim() || '';

    const environmentTranslations = [
      {
        name: this.dataForm.controls['nameEnvAr'].value,
        language: 'ar'
      },
      {
        name: this.dataForm.controls['nameEnvEn'].value,
        language: 'en'
      }
    ];

    const connectionString = this.buildConnectionString();

    const selectedServer = this.servers.find(s => s.uuid === serverValue);

    const newEnvDatabase: EnvDatabase = {
      url: this.dataForm.controls['urlEnv'].value,
      serverIDFK: serverValue,
      environmentTranslation: environmentTranslations,
      dbName: this.dataForm.controls['databaseName'].value,
      connectionString: connectionString,
      dbUserName: this.dataForm.controls['userName'].value,
      dbPassword: this.dataForm.controls['password'].value
    };

    if (selectedServer) {
      (newEnvDatabase as any).server = selectedServer;
    }

    this.envDatabase.push(newEnvDatabase);
    this.updateSessionWithCurrentFormData();
    this.clearSavedFormData();
    this.clearForm(); 
    this.submitted = false;

    this.layoutService.showSuccess(this.messageService, 'toast', true, this.translate.instant('Environment added successfully'));
  }

  buildConnectionString(): string {
    const serverName = this.getServerName(this.dataForm.controls['server'].value);
    const dbName = this.dataForm.controls['databaseName'].value || '';
    const userName = this.dataForm.controls['userName'].value || '';
    const password = this.dataForm.controls['password'].value || '';

    return `Server=${serverName};Database=${dbName};User Id=${userName};Password=${password};`;
  }

  getServerName(serverUuid: string): string {
    const server = this.servers.find(s => s.uuid === serverUuid);
    const serverName = server?.hostname || server?.ipAddress || 'Unknown Server';

    return serverName;
  }

  removeEnvironment(index: number) {
    this.envDatabase.splice(index, 1);

    this.updateSession();


  }

  getEnvironmentName(environmentTranslation: any[], language: string): string {

    if (!environmentTranslation || !Array.isArray(environmentTranslation)) {
      return '';
    }

    const translation = environmentTranslation.find(t => t.language === language);
    const result = translation ? translation.name : '';

    return result;
  }

  getEnvironmentDisplayName(environmentTranslation: any[]): string {
    return this.layoutService.config.lang === 'ar' ? this.getEnvironmentName(environmentTranslation, 'ar') : this.getEnvironmentName(environmentTranslation, 'en');
  }

  updateSession() {
    if (!this.session) {
      this.session = {};
    }

    this.session.envDatabases = this.envDatabase;
    this.provisionedService.setSession(this.session);
  }

  ngOnDestroy() {
    const currentUrl = this.router.url;
    const isStillInWizard = currentUrl.includes('/layout-admin/add/');
    
    if (!isStillInWizard && !this.isNavigatingWithinWizard) {
      this.clearAllSavedData();
    }

    if (this.saveDataSubscription) {
      this.saveDataSubscription.unsubscribe();
    }
  }

  clearAllSavedData() {
    this.provisionedService.clearSession();
    sessionStorage.removeItem('currentEnvironmentFormData');
    sessionStorage.removeItem('currentCustomerServiceFormData');
    sessionStorage.removeItem('provisionedSessionData');
    sessionStorage.removeItem('editingProvisionedServiceId');
  }

  async editEnvironment(index: number) {
    this.isEditingEnvironment = true;
    this.editingEnvironmentIndex = index;

    const envToEdit = this.envDatabase[index];

    const enTrans = envToEdit.environmentTranslation.find(t => t.language === 'en')?.name;
    const arTrans = envToEdit.environmentTranslation.find(t => t.language === 'ar')?.name;

    let temp = {
      nameEnvEn: enTrans,
      nameEnvAr: arTrans,
      urlEnv: envToEdit.url,
      server: envToEdit.server?.uuid,
      databaseName: envToEdit.dbName,
      userName: envToEdit.dbUserName,
      password: envToEdit.dbPassword,
    };
    this.dataForm.patchValue(temp);


    setTimeout(() => {
      document.querySelector('.box-shadow')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  saveEnvironmentEdit() {
    if (this.dataForm.invalid) {
      this.submitted = true;
      return;
    }

    const environmentTranslations = [
      {
        name: this.dataForm.controls['nameEnvAr'].value || '',
        language: 'ar'
      },
      {
        name: this.dataForm.controls['nameEnvEn'].value || '',
        language: 'en'
      }
    ];

    const serverValue = this.dataForm.controls['server'].value?.trim() || '';

    const selectedServer = this.servers.find(s => s.uuid === serverValue);



    const connectionString = this.buildConnectionString();


    const updatedEnvDatabase: EnvDatabase = {
      url: this.dataForm.controls['urlEnv'].value || '',
      serverIDFK: this.dataForm.controls['server'].value.toString(),
      environmentTranslation: environmentTranslations,
      dbName: this.dataForm.controls['databaseName'].value || '',
      connectionString: connectionString,
      dbUserName: this.dataForm.controls['userName'].value || '',
      dbPassword: this.dataForm.controls['password'].value || ''
    };

    if (selectedServer) {
      (updatedEnvDatabase as any).server = selectedServer;
    }

    this.envDatabase[this.editingEnvironmentIndex] = updatedEnvDatabase;

    this.updateSession();

    this.cancelEnvironmentEdit();

    this.layoutService.showSuccess(this.messageService, 'toast', true, this.translate.instant('Environment updated successfully'));
  }

  cancelEnvironmentEdit() {
    this.isEditingEnvironment = false;
    this.editingEnvironmentIndex = -1;
    this.clearForm();
    this.submitted = false;
  }

}
