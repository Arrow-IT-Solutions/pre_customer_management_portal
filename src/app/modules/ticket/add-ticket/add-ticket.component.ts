import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentResponse, AgentSearchRequest } from '../../agent/agent.module';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TicketsService } from 'src/app/Core/services/tickets.service';
import { AgentsService } from 'src/app/Core/services/agents.service';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TicketRequest, TicketUpdateRequest } from '../ticket.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  file: any;
  fileInput: any;
  agent: AgentResponse[] = [];
  agentOptions: { label: string; value: string }[] = [];
  agentsList: any[] = [];
  agentIDFK?: string;


  constructor(
    public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public agentService: AgentsService,
    private ticketService: TicketsService,
    public constantService: ConstantService,
    public messageService: MessageService,
    public translate: TranslateService,

    public route: ActivatedRoute

  ) {
    this.dataForm = this.formBuilder.group({
      description: ['', Validators.required],
      agentIDFK: ['', Validators.required],
      status: ['0']
    });

  }



  async ngOnInit() {
    try {
      this.loading = true;

      this.route.queryParams.subscribe(params => {
        this.agentIDFK = params['agentIDFK'] || null;
        if (this.agentIDFK) {
          this.dataForm.patchValue({ agentIDFK: this.agentIDFK });
          console.log('loaded agentIDFK from route:', this.agentIDFK);
        }
      });
      await this.RetrieveAgent();

      if (this.ticketService.SelectedData != null) {
        await this.FillData();
      }

      if(this.agentIDFK != null){
        this.dataForm.patchValue({ agentIDFK: this.agentIDFK, status: '0' });
        this.dataForm.get('agentIDFK')?.disable();
      }
    } catch (exceptionVar) {
      console.error(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    try {
      this.btnLoading = true;

      console.log("submit!")
      if (this.dataForm.invalid) {
        console.log("invalidData!")
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

    if (this.ticketService.SelectedData != null) {
      // update
      var ticket: TicketUpdateRequest = {
        uuid: this.ticketService.SelectedData?.uuid?.toString(),
        agentIDFK: this.dataForm.controls['agentIDFK'].value.toString(),
        description: this.dataForm.controls['description'].value.toString(),
        status: this.dataForm.controls['status'].value,
      };
      console.log("ticket to update: ", ticket)
      response = await this.ticketService.Update(ticket);

    }
    else {
      // add
      var addTicket: TicketRequest = {
        agentIDFK: this.dataForm.controls['agentIDFK'].value.toString(),
        description: this.dataForm.controls['description'].value.toString(),
        status: this.dataForm.controls['status'].value,
      };
      console.log("ticket to add: ", addTicket)

      response = await this.ticketService.Add(addTicket);
    }

    console.log("save response: ", response);

    if (response?.requestStatus?.toString() === '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
      if (!this.ticketService.SelectedData) {
        this.resetForm();
      } else {
        console.log('error adding/ updating ticket')

      }
      setTimeout(() => {
        this.agentService.Dialog.adHostChild.viewContainerRef?.clear();
        this.agentService.Dialog.adHostDynamic.viewContainerRef?.clear();
        this.agentService.triggerRefreshAgents();
      }, 600);
    } else {
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
    }

    this.btnLoading = false;
    this.submitted = false;
  }


  async FillData() {

    let temp = {
      description: this.ticketService.SelectedData?.description || '',
      agentIDFK: this.ticketService.SelectedData?.agent?.uuid ?? '',
      status: this.ticketService.SelectedData?.status || '0',
    };

    console.log("agentIDFK: ", temp.agentIDFK)
    this.dataForm.patchValue(temp);
    if (temp.agentIDFK) {
    this.dataForm.get('agentIDFK')?.disable();
    } 
    else {
    this.dataForm.get('agentIDFK')?.enable();
    }

  }

  resetForm() {
    this.dataForm.reset({ status: '0' });
  }

  async RetrieveAgent() {
    let filter: AgentSearchRequest = {
        uuid: '',
        name: '',
        pageIndex: '0',
        pageSize: '10'
  
      };
  
      const rawResponse = (await this.agentService.Search(filter)) as any;
  
      this.agentsList = rawResponse.data;
      console.log("agent list: ", this.agentsList)
      const lang = this.layoutService.config.lang || 'en';
      this.agentOptions = (rawResponse.data ?? []).map((item: AgentResponse) => ({
        label: item.agentTranslation?.[lang]?.name ?? 'Unknown Agent',
        value: item.uuid
      }));
  
  }

  async OpenInfoPage(response) {
  
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      this.ticketService.SelectedData = response
      let content = 'Info';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
    }
  
}
