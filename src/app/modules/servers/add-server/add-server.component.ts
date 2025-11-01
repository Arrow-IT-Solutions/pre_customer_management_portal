import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { ServerRequest, ServerUpdateRequest } from '../servers.module';

@Component({
  selector: 'app-add-server',
  templateUrl: './add-server.component.html',
  styleUrls: ['./add-server.component.scss'],
  providers: [MessageService]
})
export class AddServerComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  constructor(public formBuilder: FormBuilder,
    public messageService: MessageService,
    public serverService: ServersService,
    public layoutService: LayoutService,

  ) {
    this.dataForm = this.formBuilder.group({
      hostname: ['', Validators.required],
      ipAddress: ['', Validators.required],
      
    })
  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }
  async ngOnInit() {
    try {
      this.loading = true;

      if (this.serverService.SelectedData != null) {
        await this.FillData();
      }
    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.dataForm.invalid) {
      this.layoutService.showError(this.messageService, 'toast', true, 'Please fill all required fields');
      this.submitted = true;
      return;
    }
    try {
      this.btnLoading = true;
      await this.Save();
    } catch (exceptionVar) {
    } finally {
      this.btnLoading = false;
    }
  }

  async Save() {
    let response;

    if (this.serverService.SelectedData != null) {
      // update
      var updateServer: ServerUpdateRequest = {
        uuid: this.serverService.SelectedData?.uuid?.toString(),
        hostname: this.dataForm.controls['hostname'].value == null ? null : this.dataForm.controls['hostname'].value.toString(),
        ipAddress: this.dataForm.controls['ipAddress'].value == null ? null : this.dataForm.controls['ipAddress'].value.toString(),
        
      };
      response = await this.serverService.Update(updateServer);
    } else {
      // add
      var addServer: ServerRequest = {
        hostname: this.dataForm.controls['hostname'].value == null ? null : this.dataForm.controls['hostname'].value.toString(),
        ipAddress: this.dataForm.controls['ipAddress'].value == null ? null : this.dataForm.controls['ipAddress'].value.toString(),
        
      };

      response = await this.serverService.Add(addServer);
    }

    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (this.serverService.SelectedData == null) {
        this.resetForm();
        setTimeout(() => {
          this.serverService.Dialog.adHostChild.viewContainerRef.clear();
          this.serverService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.serverService.triggerRefreshServers();
        }, 600);
      } else {
        setTimeout(() => {
          this.serverService.Dialog.adHostChild.viewContainerRef.clear();
          this.serverService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.serverService.triggerRefreshServers();
        }, 600);
      }
    } else {
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
    }

    this.btnLoading = false;
    this.submitted = false;
  }

  resetForm() {
    this.dataForm.reset();
  }

  FillData() {
    let temp = {
      hostname: this.serverService.SelectedData?.hostname,
      ipAddress: this.serverService.SelectedData?.ipAddress,
     
    };

    this.dataForm.patchValue(temp);
  }
}
