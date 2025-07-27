import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentsService } from 'src/app/Core/services/agents.service';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AgentRequest, AgentUpdateRequest } from '../agent.module';
import { PasswordComponent } from '../../password/password/password.component';
import { EncryptionService } from 'src/app/shared/service/encryption.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent {
 dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  file: any;
  fileInput: any;
  img: boolean = true;
  companyOptions: any[] = [];
  isPasswordVisible: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public agentService: AgentsService,
    public constantService: ConstantService,
    public messageService: MessageService,
    public translate: TranslateService
  ) {
    this.dataForm = this.formBuilder.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      phone: ['', Validators.required],
      password: [''],
      anyDeskAddress: ['', Validators.required],
      companyIDFK: [null, Validators.required],
    });
  }
  async ngOnInit() {
    try {
      this.loading = true;
      const CompanyResponse = await this.constantService.Search('Company') as any;
      this.companyOptions = CompanyResponse.data;
      this.resetForm();

      if (this.agentService.SelectedData != null) {
        await this.FillData();
      }
    } catch (exceptionVar) {
      console.error(exceptionVar);
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
    try {
      this.btnLoading = true;

      if (this.dataForm.invalid) {
        this.submitted = true;
        return;
      }
      await this.Save();
    } catch (exceptionVar) {
    } finally {
      this.btnLoading = false;
    }
  }

  async Save() {
  
      let response;
  
      var agentTranslation = [
        {
          firstName: this.dataForm.controls['NameAr'].value == null ? '' : this.dataForm.controls['NameAr'].value.toString(),
          language: 'ar'
        },
        {
          firstName: this.dataForm.controls['NameEn'].value == null ? '' : this.dataForm.controls['NameEn'].value.toString(),
          language: 'en'
        }
      ];
  
      if (this.agentService.SelectedData != null) {
        // update
  
        var employee: AgentUpdateRequest = {
          uuid: this.agentService.SelectedData?.uuid?.toString(),
          agentTranslation: agentTranslation,
          companyIDFK: this.dataForm.controls['companyIDFK'].value.toString(),
          phone: this.dataForm.controls['Phone'].value.toString(),
          anyDeskAddress: this.dataForm.controls['anyDeskAddress'].value,
          password: (await EncryptionService.encrypt(this.dataForm.controls['password'].value.toString())),

        };
        response = await this.agentService.Update(employee);
  
  
        if (response.requestStatus == "200") {
          this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);
          this.agentService.Dialog.adHostChild.viewContainerRef.clear();
          this.agentService.Dialog.adHostDynamic.viewContainerRef.clear();
          setTimeout(() => {
            this.agentService.Dialog.adHostChild.viewContainerRef.clear();
            this.agentService.Dialog.adHostDynamic.viewContainerRef.clear();
            this.agentService.triggerRefreshAgents();
          }, 600);
        } else {
          this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
        }
  
      } else {
        // add
  
        var addEmployee: AgentRequest = {
          agentTranslation: agentTranslation,
         companyIDFK: this.dataForm.controls['companyIDFK'].value.toString(),
          phone: this.dataForm.controls['Phone'].value.toString(),
          anyDeskAddress: this.dataForm.controls['anyDeskAddress'].value,
          password: (await EncryptionService.encrypt(this.dataForm.controls['password'].value.toString())),
        };
        response = await this.agentService.Add(addEmployee);
        if (response != null) {
          if (response.requestStatus == 200) {
            this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
            this.agentService.SelectedData = response
            this.OpenInfoPage(this.agentService.SelectedData)
            this.agentService.Dialog.close();
            setTimeout(() => {
              this.agentService.Dialog.adHostChild.viewContainerRef.clear();
              this.agentService.Dialog.adHostDynamic.viewContainerRef.clear();
              this.agentService.triggerRefreshAgents();
            }, 600);
  
          } else {
            this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
          }
        }
      }
  
      this.btnLoading = false;
      this.submitted = false;
    }
  
    resetForm() {
      this.dataForm.reset();
    }
      
    async FillData() {

    console.log('HERE')
    let temp = {
      NameAr: this.agentService.SelectedData?.agentTranslation?.['ar']?.name || '',
      NameEn: this.agentService.SelectedData?.agentTranslation?.['en']?.name || '',
      Phone: this.agentService.SelectedData?.phone,
      companyIDFK: this.agentService.SelectedData?.companyIDFK ?? '',
      anyDeskAddress: this.agentService.SelectedData?.anyDeskAddress || '',
      password: this.agentService.SelectedData?.password || '',
    };     

   
    this.dataForm.patchValue(temp);

  }
  async OpenInfoPage(response) {
  
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      this.agentService.SelectedData = response
      let content = 'Info';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
      var component = this.layoutService.OpenDialog(PasswordComponent, content);
      this.agentService.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        setTimeout(() => {
          this.agentService.Dialog.adHostChild.viewContainerRef.clear();
          this.agentService.Dialog.adHostDynamic.viewContainerRef.clear();
          this.agentService.triggerRefreshAgents();
        }, 600);
        this.FillData();
      });
    }


}
