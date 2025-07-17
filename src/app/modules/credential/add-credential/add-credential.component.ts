import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialService } from 'src/app/layout/service/credential.service';
import { PortService } from 'src/app/layout/service/ports.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-credential',
  templateUrl: './add-credential.component.html',
  styleUrls: ['./add-credential.component.scss'],
  providers: [MessageService]
})
export class AddCredentialComponent {

  @Output() OnClose = new EventEmitter<void>();

  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  isPasswordVisible: boolean = false;
  portOptions: { uuid: string; portNumber: string }[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public credentialService: CredentialService,
    public portService: PortService,
    public messageService: MessageService,
    public translate: TranslateService
  ) {
    this.dataForm = formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      portIDFK: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadPorts();
      this.resetForm();
      if (this.credentialService.SelectedData != null) {
        await this.FillData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async onSubmit() {
     this.submitted = true;
      if (this.dataForm.invalid) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      return;
    }
    try {
      this.btnLoading = true;
      if (this.dataForm.invalid) {
        this.submitted = true;
        return;
      }
      await this.Save();
    } catch (error) {
      console.error(error);
    } finally {
      this.btnLoading = false;
    }
  }

  async Save() {
    let response;
    const payload: any = { ...this.dataForm.value };

    if (this.credentialService.SelectedData != null) {
      payload.uuid = this.credentialService.SelectedData.uuid;
      response = await this.credentialService.Update(payload);

      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: 'Success',
        detail: 'Updated successfully'
      });

      this.closeDialog();
    } else {
      response = await this.credentialService.Add(payload);

      this.messageService.add({
        key: 'toast',
        severity: 'success',
  summary: this.translate.instant('Success'),
        detail: this.translate.instant('Successfull_Add')
      });

      this.dataForm.reset();
      this.submitted = false;
      this.closeDialog();
    }
  }

  async loadPorts() {
    try {
      const result = await this.portService.Search({});
      this.portOptions = result?.data || [];
    } catch (error) {
      this.messageService.add({
        key: 'toast',
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load ports'
      });
    }
  }

  resetForm() {
    this.dataForm.reset();
  }

  async FillData() {
    const selected = this.credentialService.SelectedData;

    const patch = {
      userName: selected?.userName || '',
      password: selected?.password || '',
      portIDFK: selected?.portResponse?.uuid || ''
    };

    this.dataForm.patchValue(patch);
  }

  closeDialog() {
    this.credentialService.Dialog.close?.();
    this.OnClose.emit();
  }
}
