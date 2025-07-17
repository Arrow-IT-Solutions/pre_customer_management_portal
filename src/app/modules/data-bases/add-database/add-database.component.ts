import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { EnvironmentService } from 'src/app/Core/services/environments.service';
import { DatabaseService } from 'src/app/layout/service/databases.service';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-add-database',
  templateUrl: './add-database.component.html',
  styleUrls: ['./add-database.component.scss'],
  providers: [MessageService]
})
export class AddDatabaseComponent {
  @Output() OnClose = new EventEmitter<void>();

  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  isPasswordVisible: boolean = false;
  envOptions: { uuid: string; name: string }[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public messageService: MessageService, 
    public databaseService: DatabaseService, 
    public layoutService: LayoutService, 
    public environmentService: EnvironmentService, 
    public translate: TranslateService
  ) {
    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      connectionString: ['', Validators.required],
      envIDFK: ['', Validators.required]
    });
  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadEnvironments();
      this.resetForm();
      if (this.databaseService.SelectedData != null) {
        await this.FillData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
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

    if (this.databaseService.SelectedData != null) {
      payload.uuid = this.databaseService.SelectedData.uuid;
      response = await this.databaseService.Update(payload);

      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: 'Success',
        detail: 'Updated successfully'
      });

      this.closeDialog();
    } else {
      response = await this.databaseService.Add(payload);

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
  async loadEnvironments() {
    try {
      const result = await this.environmentService.Search({});
      this.envOptions = (result?.data || []).map((env: any) => {
        const lang = this.translate.currentLang || 'en';
        return {
          uuid: env.uuid,
          name: env.environmentTranslation?.[lang]?.name || 'Unnamed'
        };
      });
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
    const selected = this.databaseService.SelectedData;

    const patch = {
      name: selected?.name || '',
      userName: selected?.userName || '',
      password: selected?.password || '',
      connectionString: selected?.connectionString || '',
      envIDFK: selected?.environmentResponse?.uuid || ''
    };

    this.dataForm.patchValue(patch);
  }
  closeDialog() {
    this.databaseService.Dialog.close?.();
    this.OnClose.emit();
  }
}
