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
import { CompanyResponse, CompanySearchRequest } from '../../companies/companies.module';
import { CompaniesService } from 'src/app/layout/service/companies.service';

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
  company: CompanyResponse[] = [];
  companyOptions: { label: string; value: string }[] = [];
  companyList: any[] = []; 
  isPasswordVisible: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public agentService: AgentsService,
    private companyService: CompaniesService, 
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
      companyIDFK: ['', Validators.required],
    });
    
  }
  async ngOnInit() {
    try {
      this.loading = true;
      await this.RetrieveCompany();
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
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }
  async Save() {
  
      let response;
  
      var agentTranslation = [
        {
          name: this.dataForm.controls['nameAr'].value == null ? '' : this.dataForm.controls['nameAr'].value.toString(),
          language: 'ar'
        },
        {
          name: this.dataForm.controls['nameEn'].value == null ? '' : this.dataForm.controls['nameEn'].value.toString(),
          language: 'en'
        }
      ];
  
      if (this.agentService.SelectedData != null) {
        // update
  
        var agent: AgentUpdateRequest = {
          uuid: this.agentService.SelectedData?.uuid?.toString(),
          agentTranslation: agentTranslation,
          companyIDFK: this.dataForm.controls['companyIDFK'].value.toString(),
          phone: this.dataForm.controls['phone'].value.toString(),
          anyDeskAddress: this.dataForm.controls['anyDeskAddress'].value,
          password: this.dataForm.controls['password'].value.toString(),
        };
        response = await this.agentService.Update(agent);
  
  
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
  
        var addAgent: AgentRequest = {
          agentTranslation: agentTranslation,
          companyIDFK: this.dataForm.controls['companyIDFK'].value.toString(),
          phone: this.dataForm.controls['phone'].value.toString(),
          anyDeskAddress: this.dataForm.controls['anyDeskAddress'].value,
          password: this.dataForm.controls['password'].value.toString(),
        };
        response = await this.agentService.Add(addAgent);
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
           console.log(addAgent);

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
      nameAr: this.agentService.SelectedData?.agentTranslation?.['ar']?.name || '',
      nameEn: this.agentService.SelectedData?.agentTranslation?.['en']?.name || '',
      phone: this.agentService.SelectedData?.phone,
      companyIDFK: this.agentService.SelectedData?.companyIDFK ?? '',
      anyDeskAddress: this.agentService.SelectedData?.anyDeskAddress || '',
      password: '',
    };     

    console.log('Patch values:', temp);
    this.dataForm.patchValue(temp);

  }
  getCompanyLabel(): string {
  return this.layoutService.config.lang === 'ar' ? 'nameAr' : 'nameEn';
}
async RetrieveCompany() {
     let filter: CompanySearchRequest = {
          uuid: '',
          name: '',
          primaryContact: '',
          phone: '',
          email: '',
          pageIndex: '0',
          pageSize: '10'

        };

        const rawResponse = (await this.companyService.Search(filter)) as any;

    console.log('Raw response:', rawResponse);

  this.companyList = rawResponse.data;

  const lang = this.layoutService.config.lang || 'en';


  this.companyOptions = (rawResponse.data ?? []).map((item: CompanyResponse) => ({
  label: item.companyTranslation?.[lang]?.name ?? 'Unknown Company',
  value: item.uuid
}));





    console.log('Company Services Dropdown:', this.companyOptions);
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
