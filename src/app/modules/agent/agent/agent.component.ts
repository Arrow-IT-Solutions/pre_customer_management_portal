import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { AgentResponse, AgentSearchRequest, AgentTranslationResponse } from '../agent.module';
import { AgentsService } from 'src/app/Core/services/agents.service';
import { PasswordComponent } from '../../password/password/password.component';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AgentComponent {
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  dataForm!: FormGroup;
  loading = false;
  data: AgentResponse[] = [];
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  link = '';
  visible: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public agentService: AgentsService,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {
    this.dataForm = this.formBuilder.group({
      name: [''],
      companyIDFK: ['']
    });

    this.agentService.refreshAgents$.subscribe(() => {
      this.FillData();
    });
  }

  async ngOnInit() {
    await this.FillData();
  }

  Search() {
    this.FillData();
  }
  
  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.totalRecords = 0;
    let filter: AgentSearchRequest = {
      name: this.dataForm.controls['name'].value,
      phone: this.dataForm.controls['phone'].value,
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString(),
    };
    const response = (await this.agentService.Search(filter)) as any;
    console.log(response)
    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.totalRecords = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.totalRecords = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;
  }
 
  OnChange() {
    if (this.isResetting) { return }; 

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);

  }

   paginate(event: any) {
      this.pageSize = event.rows
      this.first = event.first
      this.FillData(event.first)
  
    }
    showDialog(link: string) {
      this.link = link;
      this.visible = true;
    }

  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }

  openAddAgent(row: AgentResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.agentService.SelectedData = row;
    let content = this.agentService.SelectedData == null ? 'Create_Agent' : 'Update_Agent';

    this.translate.get(content).subscribe((res: string) => {
      content = res;
    });

    var component = this.layoutService.OpenDialog(AddAgentComponent, content);
    this.agentService.Dialog = component;

    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      if (row == null)
        this.OpenInfoPage(this.agentService.SelectedData)
      });    
  }

    

  async OpenInfoPage(response) {
  
      console.log('here')
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      this.agentService.SelectedData = response
      console.log('selectedData', this.agentService.SelectedData)
      let content = 'Info';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
     var component = this.layoutService.OpenDialog(PasswordComponent, content);
     this.agentService.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.FillData();
      });
    }
  
  confirmDelete(row: AgentResponse) {
  
      console.log(row)
      this.confirmationService.confirm({
        message: this.translate.instant("Do_you_want_to_delete_this_record?"),
        header: this.translate.instant("Delete_Confirmation"),
        icon: 'pi pi-info-circle',
        key: 'positionDialog',
        closeOnEscape: true,
        accept: async () => {
          const response = (await this.agentService.Delete(row.uuid!)) as any;
  
          this.confirmationService.close();
  
          this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);
  
          this.FillData();
  
        },
        reject: () => {
          // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
        },
      });
    }

 
  
    
  
    
}
