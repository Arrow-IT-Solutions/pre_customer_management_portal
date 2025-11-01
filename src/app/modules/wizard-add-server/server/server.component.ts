import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ProvisionedServerRequest } from '../../servers/servers.module';
import { EncryptionService } from 'src/app/shared/service/encryption.service';
import { WizardStep } from 'src/app/shared/models/wizrd-step';
import { debounceTime } from 'rxjs/operators';
import { WizardComponent } from '../wizard/wizard.component';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements OnInit, WizardStep {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  isPasswordVisible: boolean = false;
  private isNavigatingToApplication = false;
  private isNavigatingWithinWizard = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public serverService: ServersService,
    private wizard: WizardComponent) {
    this.dataForm = formBuilder.group({
      hostname: ['', Validators.required],
      ipAddress: ['', Validators.required],
      username: [''],
      password: [''],
      url: [''],
      tag: ['', Validators.required],
      fillAppsNow: [false]
    });


  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    if (this.serverService.SelectedData) {
      await this.FillData();
    }
    const raw = sessionStorage.getItem('wizardServer');
    if (raw) {
      this.dataForm.patchValue(JSON.parse(raw));
    }
    this.dataForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(full => {
        sessionStorage.setItem('wizardServer', JSON.stringify(full));
        this.serverService.serverHelper = {
          applications: this.serverService.serverHelper?.applications || [],
          ...full
        };
      });
  }

  validate(): boolean {
    this.submitted = true;
    if (this.dataForm.invalid) {
      return false;
    }

    if (!this.dataForm.value.fillAppsNow) {
      return false;
    }

    const h: ProvisionedServerRequest = {
      uuid: this.serverService.SelectedData?.uuid || '',
      hostname: this.dataForm.value.hostname,
      ipAddress: this.dataForm.value.ipAddress,
      username: this.dataForm.value.username,
      password: this.dataForm.value.password,
      url: this.dataForm.value.url,
      tag: this.dataForm.value.tag,
      applications: []
    };
    this.serverService.serverHelper = h;
    return true;
  }

  async saveData() {

    if (this.serverService.serverHelper) {
      const plainPassword = this.dataForm.controls['password'].value;
      let encryptedPassword = await EncryptionService.encrypt(plainPassword)
      this.serverService.serverHelper = {
        ...this.serverService.serverHelper,
        hostname: this.dataForm.value.hostname,
        ipAddress: this.dataForm.value.ipAddress,
        username: this.dataForm.value.username,
        password: encryptedPassword,
        url: this.dataForm.value.url,
        tag: this.dataForm.value.tag 
      };
    }
  }

  async loadData() {
    if (this.serverService.serverHelper) {
      const h = this.serverService.serverHelper;
      let plainPass = '';
      if (h.password)
        plainPass = await EncryptionService.decrypt(h.password)

      if (h) {
        this.dataForm.patchValue({
          hostname: h.hostname,
          ipAddress: h.ipAddress,
          username: h.username,
          password: h.password,
          url: h.url,
          tag: h.tag,
          fillAppsNow: h.applications?.length > 0
        });
      }

    }

  }

  async onSubmit() {
    try {
      if (this.serverService.SelectedData != null) {

      }
      else {

      }

    } catch {

    }

  }

  async FillData() {

    let plainPass = '';
    if (this.serverService.SelectedData)
      plainPass = await EncryptionService.decrypt(this.serverService.SelectedData?.password)

    let temp = {
      hostname: this.serverService.SelectedData?.hostname,
      ipAddress: this.serverService.SelectedData?.ipAddress,
      username: this.serverService.SelectedData?.username,
      password: plainPass,
      url: this.serverService.SelectedData?.url,
      tag: this.serverService.SelectedData?.tag
    };

    this.dataForm.patchValue(temp);
  }

  async nextStep() {
  
    try {

      let response
      this.submitted = true;
      this.btnLoading = true;
      if (this.dataForm.invalid) {
        this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
        this.submitted = true;
        return;
      }

      const plainPassword = this.dataForm.controls['password'].value;
      let encryptedPassword = await EncryptionService.encrypt(plainPassword)
      const helper: ProvisionedServerRequest = {
        uuid: this.serverService.SelectedData?.uuid || '',
        hostname: this.dataForm.controls['hostname'].value.toString(),
        ipAddress: this.dataForm.controls['ipAddress'].value.toString(),
        username: this.dataForm.controls['username'].value.toString(),
        password: encryptedPassword,
        url: this.dataForm.controls['url'].value.toString(),
        tag: this.dataForm.controls['tag'].value.toString(),
        applications: [],
        deletedApps: []
      };

      this.serverService.serverHelper = helper;

      if (this.dataForm.value.fillAppsNow) {

        this.router.navigate(['layout-admin/add-server/application']);
      }
      else {
        response = await this.serverService.AddProvisioned(helper)

        if (response?.requestStatus?.toString() == '200') {
          this.wizard.finishWizard();
          this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
          this.resetForm();
          this.serverService.finish();

          this.router.navigate(['layout-admin/servers']);
        }
      }

    } catch {

    }

  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  resetForm() {
    this.dataForm.reset();
  }

}


