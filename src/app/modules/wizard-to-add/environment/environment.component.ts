import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { EnvDatabase, ProvisionedServiceRequest, ProvisionedSession } from '../wizard-to-add.module';
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
    const addProvisioned: ProvisionedServiceRequest = {
      subscription: this.session.subscription,
      customerIDFK: this.session.customerIDFK,
      serviceIDFK: this.session.serviceIDFK,
      envDatabases: this.envDatabase
    };

    response = await this.provisionedService.Add(addProvisioned);
    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);

      setTimeout(() => {
        this.envDatabase = [];
        this.resetForm();
        this.provisionedService.clearSession();

        this.isNavigatingToCustomerService = true;
        this.router.navigate(['layout-admin/add/customer-service']);
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
      await this.RetriveServer();
      
        this.session = this.provisionedService.getSession();
        if (this.session.envDatabases && this.session.envDatabases.length > 0) {
          this.envDatabase = this.session.envDatabases;
        }
      

      this.resetForm();

    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

   async RetriveServer() {

    var serverID: any;

    let filter: ServerSearchRequest = {

      hostname: '',
      uuid: serverID,
      pageIndex: "",
      pageSize: '100000'

    }
    const response = await this.serverService.Search(filter) as any

    this.servers = response.data,

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
    return server?.hostname || '';
  }

  removeEnvironment(index: number) {
    this.envDatabase.splice(index, 1);

    this.updateSession();

   // this.layoutService.showSuccess(this.messageService, 'toast', true, 'تم حذف البيئة بنجاح');
  }

  getEnvironmentName(environmentTranslation: any[], language: string): string {
    const translation = environmentTranslation.find(t => t.language === language);
    return translation ? translation.name : '';
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
    }
  }
}
