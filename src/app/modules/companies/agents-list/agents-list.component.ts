import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentsService } from 'src/app/Core/services/agents.service';
import { CompaniesService } from 'src/app/layout/service/companies.service';
import { AgentResponse, AgentSearchRequest, CompanyResponse } from 'src/app/modules/companies/companies.module';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.scss']
})
export class AgentsListComponent implements OnInit {
  companyData: CompanyResponse | null = null;
  companyName: string = '';
  companyId: string = '';
  data: AgentResponse[] = [];
  totalRecords: number = 0;
  pageSize: number = 12;
  pageIndex: number = 0;
  first: number = 0;
  loading: boolean = false;
  dataForm!: FormGroup;
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  showFilter: boolean = false;
  showAddForm: boolean = false;
  selectedAgent: AgentResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private agentsService: AgentsService,
    public companiesService: CompaniesService,
    public layoutService: LayoutService,
    public agentService: AgentsService,
    public translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.dataForm = new FormGroup({
      name: new FormControl(''),
      companyIDFK: new FormControl(this.companyId || '')
    });

    await this.loadCompanyInfo();
  }


  private async loadCompanyInfo() {
    this.loading = true;
    try {

      if (this.companiesService.SelectedData?.uuid) {
        this.setCompany(this.companiesService.SelectedData);
        await this.FillData();
        return;
      }


      const savedData = localStorage.getItem('selectedCompany');
      if (savedData) {
        const company = JSON.parse(savedData);
        this.companiesService.SelectedData = company;
        this.setCompany(company);
        await this.FillData();
        return;
      }

      this.companyName = '-';
    } catch (err) {
      console.error('Error loading company or agents', err);
      this.companyName = '-';
      this.data = [];
    } finally {
      this.loading = false;
    }
  }

  private setCompany(company: CompanyResponse) {
    this.companyData = company;
    this.companyId = company.uuid ?? '';
    this.companyName = this.extractCompanyName(company);
    this.dataForm.get('companyIDFK')?.setValue(this.companyId);
  }

  private extractCompanyName(company: CompanyResponse): string {
    if (!company?.companyTranslation) return '';
    const lang = this.layoutService.config.lang;
    if (company.companyTranslation[lang]?.name)
      return company.companyTranslation[lang]?.name!;
    const keys = Object.keys(company.companyTranslation);
    return keys.length > 0 ? company.companyTranslation[keys[0]]?.name ?? '' : '';
  }


  async FillData(pageIndex: number = 0): Promise<void> {
    if (!this.companyId) return;
    this.loading = true;

    try {
      const filter: AgentSearchRequest = {
        name: this.dataForm.controls['name'].value,
        companyIDFK: this.companyId,
        pageIndex: pageIndex.toString(),
        pageSize: this.pageSize.toString()
      };

      const response = await this.agentService.Search(filter);

      this.data = response?.data ?? [];
      this.totalRecords = Number(response?.totalRecords ?? this.data.length);
      this.pageIndex = pageIndex;
    } catch (err) {
      console.error('Error fetching agents', err);
      this.data = [];
      this.totalRecords = 0;
    } finally {
      this.loading = false;
    }
  }

    OnChange() {
    if (this.isResetting) return;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.FillData();
    }, this.doneTypingInterval);
  }

  async paginate(event: any) {
    this.pageSize = event.rows
    this.first = event.first
    this.FillData(event.first)
  }


  async resetform() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.FillData();
    this.isResetting = false;
  }

  Search() {
    this.FillData();
  }

  getAgentName(agent: AgentResponse): string {
    const lang = this.layoutService.config.lang;
    return agent.agentTranslation?.[lang]?.name || '-';
  }

  openAddAgent(row: AgentResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.selectedAgent = row;
    this.showAddForm = true;
  }

  closeAddAgentForm(refresh: boolean = false) {
    this.showAddForm = false;
    this.selectedAgent = null;
    if (refresh) this.FillData();
  }
}
