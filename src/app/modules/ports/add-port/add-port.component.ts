import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { PortService } from 'src/app/layout/service/ports.service';
import { ServerResponse } from '../../servers/servers.module';
import { ServersService } from 'src/app/layout/service/servers.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-port',
  templateUrl: './add-port.component.html',
  styleUrls: ['./add-port.component.scss'],
  providers: [MessageService]
})
export class AddPortComponent implements OnInit {
  @Output() OnClose = new EventEmitter<void>();

  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  serverOptions: ServerResponse[] = [];

  constructor(
    public formBuilder: FormBuilder, 
    public messageService: MessageService, 
    public portService: PortService, 
    public layoutService: LayoutService, 
    public serverService: ServersService,
    public translate: TranslateService
  ) {
    this.dataForm = this.formBuilder.group({
       portNumber: ['', Validators.required],
  serverIDFK: ['', Validators.required]
    });
  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async ngOnInit() {
    try {
      this.loading = true;
      await this.loadServers();
      this.resetForm();
      if (this.portService.SelectedData != null) {
        await this.FillData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
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

    if (this.portService.SelectedData != null) {
      payload.uuid = this.portService.SelectedData.uuid;
      response = await this.portService.Update(payload);

      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: 'Success',
        detail: 'Updated successfully'
      });
      this.closeDialog();
    } else {
      response = await this.portService.Add(payload);
     if (response.requestStatus =="200"){
      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: this.translate.instant('Success'),
        detail: this.translate.instant('Successfull_Add')
      });
    }
      this.dataForm.reset();
      this.submitted = false;
      this.closeDialog();
    }
  }
  async loadServers() {
    try {
      const result = await this.serverService.Search({});
      this.serverOptions = (result?.data || []).map((server: any) => {
        return {
          uuid: server.uuid,
          hostname: server.hostname
        };
      });
    } catch (error) {
      this.messageService.add({
        key: 'toast',
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load servers'
      });
    }
  }
  resetForm() {
    this.dataForm.reset();
  }
  async FillData() {
    const selected = this.portService.SelectedData;

    const patch = {
      portNumber: selected?.portNumber || '',
      serverIDFK: selected?.serverResponse?.uuid || ''
    };

    this.dataForm.patchValue(patch);
  }
  closeDialog() {
    this.portService.Dialog.close?.();
    this.OnClose.emit();
  }
}
