import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { CredentialService } from "src/app/layout/service/credential.service";
import { LayoutService } from "src/app/layout/service/layout.service";
import { PortService } from "src/app/layout/service/ports.service";
import { Component, OnInit } from '@angular/core';
import { EncryptionService } from "src/app/shared/service/encryption.service";
import { CredentialRequest, CredentialUpdateRequest } from "../credential.module";

@Component({
  selector: 'app-add-credential',
  templateUrl: './add-credential.component.html',
  styleUrls: ['./add-credential.component.scss']
})
export class AddCredentialComponent implements OnInit {
  dataForm!: FormGroup;
  submitted = false;
  btnLoading = false;
  isPasswordVisible = false;
  portOptions: { uuid: string; portNumber: string }[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public messageService: MessageService,
    public credentialService: CredentialService,
    public layoutService: LayoutService,
    public portService: PortService
  ) {
    this.dataForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      portIDFK: ['', Validators.required]
    });
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async ngOnInit() {
    await this.loadPorts();

    this.loadSelectedData();
  }

  private async loadPorts() {
    try {
      const ports = await this.portService.Search({});
      this.portOptions = ports.data || [];
    } catch (error) {
      this.messageService.add({
        key: 'toast',
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load ports'
      });
    }
  }

  loadSelectedData() {
    if (this.credentialService.SelectedData != null) {
      const data = this.credentialService.SelectedData;
      this.dataForm.patchValue({
        userName: data.userName,
        password: data.password,
        portIDFK: data.portResponse?.uuid || ''
      });
    } else {
      this.credentialService.SelectedData = null;
      this.dataForm.reset();
      this.submitted = false;
    }
  }

  async onSubmit() {
    try {
      this.submitted = true;
      if (this.dataForm.invalid) {
        this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
        this.submitted = true;
        return;
      }
      this.btnLoading = true;

      await this.Save();

    } catch (error) {
      console.error(error);
    } finally {
      this.btnLoading = false;
    }
  }

  async Save() {
    let response;
    let password = this.dataForm.controls['password'].value.toString();
    let encryptedPass = EncryptionService.encrypt(password);


    if (this.credentialService.SelectedData != null) {
      // update
      var credential: CredentialUpdateRequest = {
        userName: this.dataForm.controls['userName'].value.toString(),
        password: (await encryptedPass),
        portIDFK: this.dataForm.controls['portIDFK'].value.toString(),
        uuid: this.credentialService.SelectedData?.uuid?.toString(),
      };
      response = await this.credentialService.Update(credential);

    } else {
      // add

      var addCredential: CredentialRequest = {

        userName: this.dataForm.controls['userName'].value.toString(),
        password: (await encryptedPass),
        portIDFK: this.dataForm.controls['portIDFK'].value.toString(),
      };
      response = await this.credentialService.Add(addCredential);
      this.resetForm();
    }

    if (response != null) {
      if (response.requestStatus == 200) {
        this.credentialService.SelectedData = response
        setTimeout(() => {
          this.credentialService.Dialog.adHostChild.viewContainerRef.clear();
          this.credentialService.Dialog.adHostDynamic.viewContainerRef.clear();
        }, 600);
      }
    }

    this.btnLoading = false;
    this.submitted = false;


  }

  resetForm() {
    this.dataForm.reset();
  }
}
