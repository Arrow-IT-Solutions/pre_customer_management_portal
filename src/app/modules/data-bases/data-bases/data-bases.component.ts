import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatabaseService } from 'src/app/layout/service/databases.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddDatabaseComponent } from '../add-database/add-database.component';
import { DatabaseResponse, DatabaseSearchRequest } from '../data-bases.module';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { EnvironmentResponse } from '../../environment/environment.module';
import { EnvironmentService } from 'src/app/Core/services/environments.service';

@Component({
  selector: 'app-data-bases',
  templateUrl: './data-bases.component.html',
  styleUrls: ['./data-bases.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DataBasesComponent implements OnInit {
  dataForm!: FormGroup;
  doneTypingInterval =1000;
  typingTimer: any;
  loading = false;
  pageSize:number = 12;
  first = 0;
  totalRecords: number = 0;
  data: DatabaseResponse[] = [];
  isResetting: boolean = false;
  formChangesSub!: Subscription;
  envOptions : EnvironmentResponse[] = [];
  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public databaseService: DatabaseService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    public environmentService: EnvironmentService
  ) {
    this.dataForm = this.formBuilder.group({
      name: [''],
      UserName: [''],
       envIDFK: ['']
    });
  }

  async ngOnInit() {
     await this.FillEnvironments();
    await this.fillData(0);
    this.formChangesSub = this.dataForm.valueChanges
      .pipe(
        debounceTime(this.doneTypingInterval),
        distinctUntilChanged(),
        filter(() => !this.isResetting)
      )
      .subscribe(() => this.fillData(0));
  }

 async FillEnvironments() {

  const response = await this.environmentService.Search({});
  this.envOptions = (response?.data || []).map((env: any) => {
    const lang = this.translate.currentLang || 'en';
    return {
      uuid: env.uuid,
      name: env.environmentTranslation?.[lang]?.name || 'Unnamed'
    };
  });
}

getEnvName(row: DatabaseResponse): string {
  const env = row.environmentResponse;
  if (!env || !env.environmentTranslation) return '-';

  const lang = this.translate.currentLang || 'en';
  return env.environmentTranslation[lang]?.name || '-';
}

  async fillData(pageIndex: number = 0) {
    this.first = pageIndex * this.pageSize;
    this.loading = true;

    const filter: DatabaseSearchRequest = {
      name: this.dataForm.get('name')?.value || '',
      userName: this.dataForm.get('UserName')?.value || '',
      envIDFK: this.dataForm.get('envIDFK')?.value || '',
      pageIndex: pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    try {
      const response = await this.databaseService.Search(filter) as any;
      this.data = [...(response?.data || [])];
      this.totalRecords = Number(response?.totalRecords || 0);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('Error'),
        detail: this.translate.instant('Failed to load databases')
      });
    }

    this.loading = false;
  }

  OnChange() {
    if (this.isResetting) return;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.fillData(0);
    }, this.doneTypingInterval);
  }
  paginate(event: any) {
    this.first = event.first;
    this.pageSize = event.rows;
    const pageIndex = Math.floor(event.first / event.rows);
    console.log('pageIndex:', pageIndex, 'first:', this.first, 'pageSize:', this.pageSize);
    this.fillData(pageIndex);
  }


  openDialog(row: DatabaseResponse | null = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    this.databaseService.SelectedData = row;

    let content = row ? 'Update_DataBase' : 'Create_DataBase';
    this.translate.get(content).subscribe(res => content = res);

    const comp = this.layoutService.OpenDialog(AddDatabaseComponent, content);
    this.databaseService.Dialog = comp;
    comp.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.fillData(Math.floor(this.first / this.pageSize));
    });
  }

  async resetForm() {
    this.isResetting = true;
    this.dataForm.reset();
    await this.fillData(0);
    this.isResetting = false;
  }

  async confirmDelete(row: DatabaseResponse) {
    this.confirmationService.confirm({
      message: this.translate.instant('Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.databaseService.Delete(row.uuid!) as any;
               this.messageService.add({
          key: 'toast',
          severity: 'success',
          summary: this.translate.instant('Success'),
          detail: this.translate.instant('Deleted_successfully')
        });
          this.fillData(Math.floor(this.first / this.pageSize));
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Error'),
            detail: this.translate.instant('Failed_to_delete')
          });
        }
      }
    });
  }
}
