import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
   constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public serverService: ServersService,
    public provisionedService: ProvisionedService,
    public translate: TranslateService

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
    try {
      this.btnLoading = true;

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
      const updateProvisioned: ProvisionedServiceUpdateRequest = {
        uuid: this.editingServiceId,
        customerIDFK: this.session.customerIDFK,
        serviceIDFK: this.session.serviceIDFK,
        subscription: {
          uuid: '', 
          startDate: this.session.subscription?.startDate,
          endDate: this.session.subscription?.endDate,
          price: this.session.subscription?.price,
          status: this.session.subscription?.status,
          customerServiceIDFK: this.editingServiceId
        },
        envDatabases: this.envDatabase.map(env => ({
          url: env.url,
          serverIDFK: env.serverIDFK,
          environmentTranslation: env.environmentTranslation.map(et => ({
            uuid: '', 
            name: et.name,
            language: et.language
          })),
          dbName: env.dbName,
          connectionString: env.connectionString,
          dbUserName: env.dbUserName,
          dbPassword: env.dbPassword
        }))
      };

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
          this.router.navigate(['layout-admin/customer-services']);
        } else {
          this.isNavigatingToCustomerService = true;
          this.router.navigate(['layout-admin/add/customer-service']);
        }
        this.btnLoading = false;
      }, 2000);
    } else {
      console.error('Error response:', response);
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
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

      try {
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
          });
        }
      } catch (error) {
        console.log('No existing session found');
        this.envDatabase = [];
      }

      this.resetForm();

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
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

    const newEnvDatabase: EnvDatabase = {
      url: this.dataForm.controls['urlEnv'].value || '',
      serverIDFK: this.dataForm.controls['server'].value || '',
      environmentTranslation: environmentTranslations,
      dbName: this.dataForm.controls['databaseName'].value || '',
      connectionString: connectionString,
      dbUserName: this.dataForm.controls['userName'].value || '',
      dbPassword: this.dataForm.controls['password'].value || ''
    };

    this.envDatabase.push(newEnvDatabase);

    this.updateSession();

    this.resetForm();
    this.submitted = false;

  //  this.layoutService.showSuccess(this.messageService, 'toast', true, 'تم إضافة البيئة بنجاح');
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

    if (this.envDatabase && this.envDatabase.length > 0) {
      const serverIdToMatch = serverFK ? serverFK.toString() : '';
      const envWithServer = this.envDatabase.find(env => 
        env.serverIDFK?.toString() === serverIdToMatch && (env as any).server
      );
      
      if (envWithServer && (envWithServer as any).server) {
        const serverData = (envWithServer as any).server;
        const result = serverData.hostname || serverData.ipAddress || 'Unknown Server';

        return result;
      }
    }

    if (!this.servers || this.servers.length === 0) {
      return 'N/A';
    }

    const serverIdToMatch = serverFK ? serverFK.toString() : '';

    let server = this.servers.find(s => {
      const serverId = s.uuid ? s.uuid.toString() : '';
      return serverId === serverIdToMatch;
    });

    if (!server) {
      server = this.servers.find(s => {
        const properties = ['serverIDPK', 'id', 'serverId'];
        for (const prop of properties) {
          const serverId = (s as any)[prop] ? (s as any)[prop].toString() : '';
          if (serverId === serverIdToMatch) {
            return true;
          }
        }
        return false;
      });
    }

    const result = server ? (server.hostname || server.ipAddress || 'Unknown Server') : 'N/A';
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
}
