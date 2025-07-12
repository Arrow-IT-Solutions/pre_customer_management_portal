import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { CredentialService } from "src/app/layout/service/credential.service";
import { LayoutService } from "src/app/layout/service/layout.service";
import { PortService } from "src/app/layout/service/ports.service";
import { Component, OnInit } from '@angular/core';

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
    public credential: CredentialService,
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
    if (this.credential.SelectedData) {
      const data = this.credential.SelectedData;
      this.dataForm.patchValue({
        userName: data.userName,
        password: data.password,
        portIDFK: data.portResponse?.uuid || ''
      });
    } else {
      this.credential.SelectedData = null; 
      this.dataForm.reset();
      this.submitted = false;
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.dataForm.invalid) return;

    this.btnLoading = true;
    const payload: any = { ...this.dataForm.value };

    if (this.credential.SelectedData && this.credential.SelectedData.uuid) {
      payload.uuid = this.credential.SelectedData.uuid;
    }

    try {
      if (this.credential.SelectedData) {
        await this.credential.Update(payload);
        this.messageService.add({
          key: 'toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Updated successfully'
        });
        this.credential.Dialog = false;
      } else {
        await this.credential.Add(payload);
        this.messageService.add({
          key: 'toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Added successfully'
        });
        this.dataForm.reset();
        this.submitted = false;
      }

      this.credential.SelectedData = null; 

    } catch (error: any) {
      console.error('Save error:', error);
      this.messageService.add({
        key: 'toast',
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'Failed to save'
      });
    } finally {
      this.btnLoading = false;
    }
  }
}
