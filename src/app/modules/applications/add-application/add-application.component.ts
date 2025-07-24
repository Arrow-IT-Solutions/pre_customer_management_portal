import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ApplicationService } from 'src/app/layout/service/applications.service';
import { ServerResponse } from '../../servers/servers.module';
import { ServersService } from 'src/app/layout/service/servers.service';
import { TranslateService } from '@ngx-translate/core';
import { EncryptionService } from 'src/app/shared/service/encryption.service';
import { ApplicationRequest, ApplicationUpdateRequest } from '../application.module';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss'],
  providers: [MessageService]
})
export class AddApplicationComponent implements OnInit {
  @Output() OnClose = new EventEmitter<void>();

  dataForm!: FormGroup;
  submitted = false;
  btnLoading = false;
  serverOptions: ServerResponse[] = [];

  constructor(
    public formBuilder: FormBuilder, 
    public messageService: MessageService, 
    public applicationService: ApplicationService, 
    public layoutService: LayoutService, 
    public serverService: ServersService,
    public translate: TranslateService,
  ) {
    this.dataForm = this.formBuilder.group({
      portNumber: ['', Validators.required],
      serverIDFK: ['', Validators.required],
      name: ['', Validators.required],
      url: ['', Validators.required],
      userName: [''],
      password: [''],
    });
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    await this.loadServers();
    this.loadSelectedData();
  }

  private async loadServers() {
    const result = await this.serverService.Search({ pageSize: "1000" });
    this.serverOptions = (result?.data || []).map((server: any) => ({
      uuid: server.uuid,
      hostname: server.hostname
    }));
  }

  loadSelectedData() {
    if (this.applicationService.SelectedData != null) {
      const selected = this.applicationService.SelectedData;
      this.dataForm.patchValue({
        portNumber: selected.portNumber || '',
        serverIDFK: selected.serverResponse?.uuid || '',
        url: selected.url || '',
        userName: selected.userName || '',
        password: selected.password || '',
        name: selected.name || '',
      });
    } else {
      this.applicationService.SelectedData = null;
      this.dataForm.reset();
      this.submitted = false;
    }
  }

  async onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
       this.messageService.add({
          key: 'toast',
          severity: 'error',
          summary: this.translate.instant('Error'),
        detail: this.translate.instant('Fill_Required_Fields')
      });
      return;
    }

    this.btnLoading = true;

    try {
      await this.save();
    } finally {
      this.btnLoading = false;
    }
  }

  async save() {
        let response;
        let password = this.dataForm.controls['password'].value.toString();
        let encryptedPass = EncryptionService.encrypt(password);

    if (this.applicationService.SelectedData != null) {
      //update
      var application : ApplicationUpdateRequest = {
      userName: this.dataForm.controls['userName'].value.toString(),
      portNumber:this.dataForm.controls['portNumber'].value.toString(),
      name: this.dataForm.controls['name'].value.toString(),
      serverIDFK: this.dataForm.controls['serverIDFK'].value.toString(),
      url: this.dataForm.controls['url'].value.toString(),
      password: (await encryptedPass),
      uuid: this.applicationService.SelectedData?.uuid?.toString(),

      };
      response = await this.applicationService.Update(application);
      if (response.requestStatus =="200"){
      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: this.translate.instant('Success'),
        detail: this.translate.instant('Successfull_Update')
      });
    }
    } else {
      var addApplication : ApplicationRequest={
      userName: this.dataForm.controls['userName'].value.toString(),
      name: this.dataForm.controls['name'].value.toString(),
       portNumber:this.dataForm.controls['portNumber'].value.toString(),
      serverIDFK: this.dataForm.controls['serverIDFK'].value.toString(),
      url: this.dataForm.controls['url'].value.toString(),
      password: (await encryptedPass),

      }
   
      response = await this.applicationService.Add(addApplication);

      if (response.requestStatus == "200") {
        this.messageService.add({
          key: 'toast',
          severity: 'success',
          summary: this.translate.instant('Success'),
          detail: this.translate.instant('Successfull_Add')
        });
      }
      this.applicationService.SelectedData = null;
      this.resetForm();
    }
    this.closeDialog();
  }

  resetForm() {
    this.dataForm.reset();
this.submitted = false;

  }

  closeDialog() {
    this.applicationService.Dialog.close?.();
    this.OnClose.emit();
  }
}
