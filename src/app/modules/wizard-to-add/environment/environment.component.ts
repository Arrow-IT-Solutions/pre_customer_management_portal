import { Component, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EnvDatabase, ProvisionedServiceRequest, ProvisionedSession, ProvisionedServiceUpdateRequest } from '../wizard-to-add.module';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { ServerResponse, ServerSearchRequest } from '../../servers/servers.module';
import { TranslateService } from '@ngx-translate/core';

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
  session!: ProvisionedSession;
  envDatabase: EnvDatabase[] = [];
  private isNavigatingToCustomerService = false;
  isEditMode: boolean = false;
  editingServiceId: string | null = null;
  isEditingEnvironment: boolean = false;
  editingEnvironmentIndex: number = -1;
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
     nameEnvEn:['',Validators.required],
     nameEnvAr:['',Validators.required],
     urlEnv:['',Validators.required],
     server:['',Validators.required],
     databaseName:['',Validators.required],
     userName:['',Validators.required],
     password:['',Validators.required]

    });

  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

 async onSubmit() {
   this.submitted = true;

    if (this.dataForm.invalid) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      return;
    }
    try {
      this.btnLoading = true;
// last v
      await this.Save();
    } catch (exceptionVar) {
      this.btnLoading = false;
    }
  }

  async Save() {
    if (!this.envDatabase || this.envDatabase.length === 0) {
      this.layoutService.showError(this.messageService, 'toast', true,  this.translate.instant("Environment_required"));
      return;
    }

    let response;

    if (this.isEditMode && this.editingServiceId) {
      if (!this.session) {
        this.layoutService.showError(this.messageService, 'toast', true, 'Session data is missing. Please restart the process.');
        return;
      }

      const validEnvDatabases = this.envDatabase.filter(env => {
        const hasValidUrl = env.url && env.url.trim() !== '' && env.url !== 'undefined';
        const hasValidServer = env.serverIDFK && env.serverIDFK.toString().trim() !== '' && env.serverIDFK !== 'undefined';
        const hasValidDbName = env.dbName && env.dbName.trim() !== '' && env.dbName !== 'undefined';
        const hasValidUserName = env.dbUserName && env.dbUserName.trim() !== '' && env.dbUserName !== 'undefined';
        const hasValidPassword = env.dbPassword && env.dbPassword.trim() !== '' && env.dbPassword !== 'undefined';

        const isValid = hasValidUrl && hasValidServer && hasValidDbName && hasValidUserName && hasValidPassword;

        if (!isValid) {
          console.warn('Invalid environment data:', {
            env: env,
            hasValidUrl,
            hasValidServer,
            hasValidDbName,
            hasValidUserName,
            hasValidPassword
          });
        }
        return isValid;
      });

      if (validEnvDatabases.length === 0) {
        this.layoutService.showError(this.messageService, 'toast', true, 'Please ensure all environment fields are filled correctly');
        return;
      }

      const updateProvisioned: ProvisionedServiceUpdateRequest = {
        uuid: this.editingServiceId
      };

      if (this.session.customerIDFK && this.session.customerIDFK.trim() !== '' && this.session.customerIDFK !== 'undefined') {
        updateProvisioned.customerIDFK = this.session.customerIDFK;
      }

      if (this.session.serviceIDFK && this.session.serviceIDFK.trim() !== '' && this.session.serviceIDFK !== 'undefined') {
        updateProvisioned.serviceIDFK = this.session.serviceIDFK;
      }

      if (this.session.subscription) {
        const subscriptionData: any = {
          customerServiceIDFK: this.editingServiceId
        };

        if (this.session.subscription.uuid &&
            this.session.subscription.uuid.trim() !== '' &&
            this.session.subscription.uuid !== 'undefined' &&
            this.session.subscription.uuid !== 'null') {
          subscriptionData.uuid = this.session.subscription.uuid.trim();
        } else {
          if (this.editingServiceId) {
            subscriptionData.uuid = this.editingServiceId;
          } else {
            console.log(' This might be a data issue - subscription should have UUID for updates');
          }
        }

        if (this.session.subscription.startDate) {
          subscriptionData.startDate = this.session.subscription.startDate;
        }

        if (this.session.subscription.endDate) {
          subscriptionData.endDate = this.session.subscription.endDate;
        }

        if (this.session.subscription.price) {
          subscriptionData.price = this.session.subscription.price;
        }

        if (this.session.subscription.status) {
          subscriptionData.status = this.session.subscription.status;
        }

        updateProvisioned.subscription = subscriptionData;
      } else {
        console.log(' No subscription data in session');
      }

      if (validEnvDatabases && validEnvDatabases.length > 0) {
        updateProvisioned.envDatabases = validEnvDatabases.map(env => {

          const envTranslations = Array.isArray(env.environmentTranslation)
            ? env.environmentTranslation.filter(et =>
                et &&
                et.name &&
                et.name.trim() !== '' &&
                et.name !== 'undefined' &&
                et.language &&
                et.language.trim() !== '' &&
                et.language !== 'undefined'
              )
            : [];

          const updateEnv: any = {};

          if (env.url && env.url.trim() !== '' && env.url !== 'undefined') {
            updateEnv.url = env.url.trim();
          }

          if (env.serverIDFK && env.serverIDFK.toString().trim() !== '' && env.serverIDFK !== 'undefined') {
            updateEnv.serverIDFK = env.serverIDFK.toString().trim();
          }

          if (env.dbName && env.dbName.trim() !== '' && env.dbName !== 'undefined') {
            updateEnv.dbName = env.dbName.trim();
          }

          if (env.connectionString && env.connectionString.trim() !== '' && env.connectionString !== 'undefined') {
            updateEnv.connectionString = env.connectionString.trim();
          }

          if (env.dbUserName && env.dbUserName.trim() !== '' && env.dbUserName !== 'undefined') {
            updateEnv.dbUserName = env.dbUserName.trim();
          }

          if (env.dbPassword && env.dbPassword.trim() !== '' && env.dbPassword !== 'undefined') {
            updateEnv.dbPassword = env.dbPassword.trim();
          }

          if (envTranslations.length > 0) {
            updateEnv.environmentTranslation = envTranslations.map(et => {
              const translation: any = {};

              if (et.uuid && et.uuid.trim() !== '' && et.uuid !== 'undefined') {
                translation.uuid = et.uuid.trim();
              }

              if (et.name && et.name.trim() !== '' && et.name !== 'undefined') {
                translation.name = et.name.trim();
              }

              if (et.language && et.language.trim() !== '' && et.language !== 'undefined') {
                translation.language = et.language.trim();
              }

              return translation;
            });
          }

          return updateEnv;
        });
      }

      response = await this.provisionedService.Update(updateProvisioned);
    } else {
      const addProvisioned: ProvisionedServiceRequest = {
        subscription: this.session.subscription,
        customerIDFK: this.session.customerIDFK,
        serviceIDFK: this.session.serviceIDFK,
        envDatabases: this.envDatabase
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

        if (this.isEditMode) {
          sessionStorage.removeItem('editingProvisionedServiceId');
          this.router.navigate(['layout-admin/customer-services']);
        } else {
          this.isNavigatingToCustomerService = true;
          this.router.navigate(['layout-admin/add/customer-service']);
        }
        this.btnLoading = false;
      }, 2000);
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


  resetForm() {
  this.dataForm.reset();
  }

   togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
  }

  back(){
    this.isNavigatingToCustomerService = true;
    this.router.navigate(['layout-admin/add/customer-service'], {
      queryParams: { fromBack: 'true' }
    });
  }

   async ngOnInit() {
    try {
      this.loading = true;

      this.editingServiceId = sessionStorage.getItem('editingProvisionedServiceId');
      if (this.editingServiceId) {
        this.isEditMode = true;
      }

      await this.RetriveServer();

      this.initializeServerIdMapping();

        this.session = this.provisionedService.getSession();

        if (this.session.envDatabases && this.session.envDatabases.length > 0) {
          this.envDatabase = [...this.session.envDatabases];
          this.envDatabase.forEach((env, index) => {
            console.log(`Environment ${index + 1}:`, {
              url: env.url,
              serverIDFK: env.serverIDFK,
              dbName: env.dbName,
              dbUserName: env.dbUserName,
              connectionString: env.connectionString,
              environmentTranslation: env.environmentTranslation
            });

            const server = this.findServerByMultipleIds(env.serverIDFK);
            if (!server) {
              console.warn(`Server with ID ${env.serverIDFK} not found in servers list for environment ${index + 1}`);
            } else {
              console.log(`Server found for environment ${index + 1}:`, server.hostname);
            }
          });
        }

      this.resetForm();

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  private initializeServerIdMapping() {

    this.serverIdMapping = {};

    if (this.session?.envDatabases && this.servers.length > 0) {
      this.session.envDatabases.forEach((env, index) => {
        const serverIdFK = env.serverIDFK?.toString();

        if (serverIdFK) {
          let matchedServer = this.servers.find(s =>
            s.uuid?.toString() === serverIdFK ||
            (s as any).serverIDPK?.toString() === serverIdFK ||
            (s as any).id?.toString() === serverIdFK
          );

          if (!matchedServer && this.servers[index]) {
            matchedServer = this.servers[index];
          }

          // إذا ما زلنا لم نجد، استخدم أول خادم متاح
          if (!matchedServer && this.servers.length > 0) {
            matchedServer = this.servers[0];
          }

          if (matchedServer?.uuid) {
            this.serverIdMapping[serverIdFK] = matchedServer.uuid;
          }
        }
      });
    }

    if (this.servers.length > 0) {
      for (let i = 1; i <= Math.min(this.servers.length, 10); i++) {
        const serverIndex = i - 1;
        if (this.servers[serverIndex]?.uuid && !this.serverIdMapping[i.toString()]) {
          const serverUuid = this.servers[serverIndex].uuid;
          if (serverUuid) {
            this.serverIdMapping[i.toString()] = serverUuid;
          }
        }
      }
    }

  }   async RetriveServer() {

    var serverID: any;

    let filter: ServerSearchRequest = {

      hostname: '',
      uuid: serverID,
      pageIndex: "",
      pageSize: '100000'

    }
    const response = await this.serverService.Search(filter) as any

    this.servers = response.data || [];

    this.servers.forEach((server, index) => {
      console.log(`Server ${index + 1} details:`, {
        uuid: server.uuid,
        hostname: server.hostname,
        ipAddress: server.ipAddress,
        serverIDPK: (server as any).serverIDPK,
        id: (server as any).id,
        allProperties: server
      });
    });

      await this.ReWriteServer();

  }

    ReWriteServer(): any {

    var serverDTO: any[] = []

    this.servers.map(server => {
      const serverName = server.hostname;

      var obj =
      {
        ...server,
        hostname: `${serverName}`.trim()

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

      hostname: filterInput,
      uuid: '',
      pageIndex: "",
      pageSize: '100000'
    }
    const response = await this.serverService.Search(filter) as any

    this.servers = response.data
    await this.ReWriteServer();
  }

  addEnvironment() {
    if (this.dataForm.invalid) {
      this.submitted = true;
      return;
    }

    if (this.isEditingEnvironment) {
      this.saveEnvironmentEdit();
      return;
    }

    const nameEnvAr = this.dataForm.controls['nameEnvAr'].value?.trim() || '';
    const nameEnvEn = this.dataForm.controls['nameEnvEn'].value?.trim() || '';
    const urlEnv = this.dataForm.controls['urlEnv'].value?.trim() || '';
    const serverValue = this.dataForm.controls['server'].value?.trim() || '';
    const databaseName = this.dataForm.controls['databaseName'].value?.trim() || '';
    const userName = this.dataForm.controls['userName'].value?.trim() || '';
    const password = this.dataForm.controls['password'].value?.trim() || '';

    if (!nameEnvAr || !nameEnvEn || !urlEnv || !serverValue || !databaseName || !userName || !password) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      this.submitted = true;
      return;
    }

    const environmentTranslations = [
      {
        name: nameEnvAr,
        language: 'ar'
      },
      {
        name: nameEnvEn,
        language: 'en'
      }
    ];

    const connectionString = this.buildConnectionString();

    const selectedServer = this.servers.find(s => s.uuid === serverValue);

    const newEnvDatabase: EnvDatabase = {
      url: urlEnv,
      serverIDFK: serverValue,
      environmentTranslation: environmentTranslations,
      dbName: databaseName,
      connectionString: connectionString,
      dbUserName: userName,
      dbPassword: password
    };

    if (selectedServer) {
      (newEnvDatabase as any).server = selectedServer;
    }

    this.envDatabase.push(newEnvDatabase);

    this.updateSession();

    this.resetForm();
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

  getServerNameByFK(serverFK: any, envData?: any): string {
    if (envData && envData.server) {
      const serverName = envData.server.hostname || envData.server.ipAddress || 'Unknown Server';
      return serverName;
    }

    if (!this.servers || this.servers.length === 0) {
      return 'N/A';
    }

    const serverIdToMatch = serverFK ? serverFK.toString() : '';

    const server = this.findServerByMultipleIds(serverIdToMatch);

    if (!server) {
      console.log('Available servers:', this.servers.map(s => ({
        hostname: s.hostname || 'No hostname',
        uuid: s.uuid || 'No UUID'
      })));
      return 'Server Not Found';
    }

    const result = server.hostname || server.ipAddress || 'Unknown Server';
    return result;
  }

  removeEnvironment(index: number) {
    this.envDatabase.splice(index, 1);

    this.updateSession();

   // this.layoutService.showSuccess(this.messageService, 'toast', true, 'تم حذف البيئة بنجاح');
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
    if (!this.isNavigatingToCustomerService) {
      this.provisionedService.clearSession();
      sessionStorage.removeItem('editingProvisionedServiceId');
    }
  }

  async editEnvironment(index: number) {
    this.isEditingEnvironment = true;
    this.editingEnvironmentIndex = index;

    const envToEdit = this.envDatabase[index];

    if (!this.servers || this.servers.length === 0) {
      console.log(' No servers loaded, reloading servers...');
      await this.RetriveServer();
      console.log(' Servers reloaded:', this.servers.length, 'servers found');

      this.initializeServerIdMapping();
    }

    let targetServer = this.findServerByMultipleIds(envToEdit.serverIDFK);

    if (!targetServer) {
      console.warn(' Server not found on first try, trying alternative methods...');

      await this.RetriveServer();
      this.initializeServerIdMapping();

      targetServer = this.findServerByMultipleIds(envToEdit.serverIDFK);

      if (!targetServer) {
        console.error(' Server still not found after reload');
        console.log('Available server details:', this.servers.map(s => ({
          hostname: s.hostname,
          uuid: s.uuid,
          serverIDPK: (s as any).serverIDPK,
          id: (s as any).id,
          allProps: Object.keys(s)
        })));

        if (this.servers.length > 0) {
          targetServer = this.servers[0];
          this.serverIdMapping[envToEdit.serverIDFK.toString()] = targetServer.uuid || '';
        } else {
          this.layoutService.showError(this.messageService, 'toast', true,
            `Server with ID "${envToEdit.serverIDFK}" not found and no servers available. Please contact administrator.`);
          return;
        }
      }
    }


    this.setFormValues(envToEdit, targetServer);

    setTimeout(() => {
      document.querySelector('.box-shadow')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  private serverIdMapping: { [key: string]: string } = {};

  private findServerByMultipleIds(serverId: any): any {
    if (!this.servers || !serverId) {
      console.warn('No servers or serverId provided');
      return null;
    }

    const searchId = serverId.toString();
    console.log(' Available servers:', this.servers.map(s => ({
      hostname: s.hostname,
      uuid: s.uuid,
      serverIDPK: (s as any).serverIDPK,
      id: (s as any).id
    })));

    let server = this.servers.find(s => {
      const matches = s.uuid?.toString() === searchId ||
             (s as any).serverIDPK?.toString() === searchId ||
             (s as any).id?.toString() === searchId ||
             (s as any).serverId?.toString() === searchId;

      if (matches) {
        console.log('🎯 Direct match found:', {
          hostname: s.hostname,
          uuid: s.uuid,
          serverIDPK: (s as any).serverIDPK,
          searchId: searchId
        });
      }

      return matches;
    });

    if (server) {
      return server;
    }

    const mappedUuid = this.serverIdMapping[searchId];
    if (mappedUuid) {
      server = this.servers.find(s => s.uuid === mappedUuid);
      if (server) {
        return server;
      }
    }

    const numericId = parseInt(searchId);
    if (!isNaN(numericId) && numericId > 0 && numericId <= this.servers.length) {
      const serverByIndex = this.servers[numericId - 1];
      if (serverByIndex && serverByIndex.uuid) {
        const serverUuid = serverByIndex.uuid;
        if (serverUuid) {
          this.serverIdMapping[searchId] = serverUuid;
          return serverByIndex;
        }
      }
    }

    if ((searchId === "1" || searchId === "2") && this.servers.length > 0) {
      const fallbackServer = this.servers[0];
      this.serverIdMapping[searchId] = fallbackServer.uuid || '';
      return fallbackServer;
    }

    return null;
  }

  private setFormValues(envToEdit: EnvDatabase, targetServer?: any) {

    let serverToUse = targetServer;
    if (!serverToUse) {
      serverToUse = this.findServerByMultipleIds(envToEdit.serverIDFK);
    }

    let serverIdToUse = envToEdit.serverIDFK;

    if (serverToUse && serverToUse.uuid) {
      serverIdToUse = serverToUse.uuid;
      console.log('Server details:', {
        hostname: serverToUse.hostname,
        uuid: serverToUse.uuid,
        originalId: envToEdit.serverIDFK
      });

      this.serverIdMapping[envToEdit.serverIDFK.toString()] = serverToUse.uuid;
    } else {
      console.error(' No valid server found for form setting');
      this.layoutService.showError(this.messageService, 'toast', true,
        `Cannot load server data for editing. Server ID: ${envToEdit.serverIDFK}`);
      return;
    }

    const serverExists = this.servers.some(s => s.uuid === serverIdToUse);

    if (!serverExists) {
      console.error('ERROR: Server UUID not found in dropdown options!');
      console.log('Expected UUID:', serverIdToUse);
      console.log('Available UUIDs:', this.servers.map(s => s.uuid));
      return;
    }

    setTimeout(() => {

      this.dataForm.patchValue({
        nameEnvEn: this.getEnvironmentName(envToEdit.environmentTranslation, 'en'),
        nameEnvAr: this.getEnvironmentName(envToEdit.environmentTranslation, 'ar'),
        urlEnv: envToEdit.url,
        server: serverIdToUse,
        databaseName: envToEdit.dbName,
        userName: envToEdit.dbUserName,
        password: envToEdit.dbPassword
      });

      this.cdr.detectChanges();

      setTimeout(() => {
        const currentServerValue = this.dataForm.get('server')?.value;
        if (currentServerValue === serverIdToUse) {
          console.log(' Server value set successfully!');
        } else {
          console.warn(' Server value not set correctly, retrying...');
          this.dataForm.patchValue({ server: serverIdToUse });
          this.cdr.detectChanges();
        }
      }, 200);
    }, 150);
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

    const connectionString = this.buildConnectionString();
    const selectedServerUuid = this.dataForm.controls['server'].value;

    const selectedServer = this.servers.find(s => s.uuid === selectedServerUuid);

    const originalEnv = this.envDatabase[this.editingEnvironmentIndex];
    let serverIDFKToSave = originalEnv.serverIDFK;

    const updatedEnvDatabase: EnvDatabase = {
      url: this.dataForm.controls['urlEnv'].value || '',
      serverIDFK: serverIDFKToSave,
      environmentTranslation: environmentTranslations,
      dbName: this.dataForm.controls['databaseName'].value || '',
      connectionString: connectionString,
      dbUserName: this.dataForm.controls['userName'].value || '',
      dbPassword: this.dataForm.controls['password'].value || ''
    };

    if (selectedServer) {
      (updatedEnvDatabase as any).server = selectedServer;
      this.serverIdMapping[serverIDFKToSave] = selectedServerUuid;
    }

    this.envDatabase[this.editingEnvironmentIndex] = updatedEnvDatabase;

    this.updateSession();

    this.cancelEnvironmentEdit();

    this.layoutService.showSuccess(this.messageService, 'toast', true, this.translate.instant('Environment updated successfully'));
  }

  cancelEnvironmentEdit() {
    this.isEditingEnvironment = false;
    this.editingEnvironmentIndex = -1;
    this.resetForm();
    this.submitted = false;
  }
}
