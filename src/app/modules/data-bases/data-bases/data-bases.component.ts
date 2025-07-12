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

@Component({
  selector: 'app-data-bases',
  templateUrl: './data-bases.component.html',
  styleUrls: ['./data-bases.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DataBasesComponent implements OnInit {
  dataForm!: FormGroup;
  loading = false;
  pageSize = 12;
  first = 0;
  totalRecords = 0;
  data: DatabaseResponse[] = [];
  typingTimer: any;
  doneTypingInterval = 1000;
  isResetting = false;
  formChangesSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public layoutService: LayoutService,
    public databaseService: DatabaseService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService
  ) {
    this.dataForm = this.formBuilder.group({
      name: [''],
      UserName: ['']
    });
  }

  async ngOnInit() {
    await this.fillData(0);
    this.formChangesSub = this.dataForm.valueChanges
      .pipe(
        debounceTime(this.doneTypingInterval),
        distinctUntilChanged(),
        filter(() => !this.isResetting)
      )
      .subscribe(() => this.fillData(0));
  }

 

  async fillData(pageIndex: number = 0) {
    this.first = pageIndex * this.pageSize;
    this.loading = true;

    const filter: DatabaseSearchRequest = {
      name: this.dataForm.get('name')?.value || '',
      userName: this.dataForm.get('UserName')?.value || '',
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
      message: this.translate.instant('database.Do_you_want_to_delete_this_record?'),
      header: this.translate.instant('Delete_Confirmation'),
      icon: 'pi pi-info-circle',
      acceptLabel: this.translate.instant('Yes'),
      rejectLabel: this.translate.instant('No'),
      key: 'confirmDialog',
      accept: async () => {
        try {
          const resp = await this.databaseService.Delete(row.uuid!) as any;
          this.layoutService.showSuccess(this.messageService, 'toast', true, resp?.requestMessage || 'Deleted');
          this.fillData(Math.floor(this.first / this.pageSize));
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Error'),
            detail: this.translate.instant('database.Failed_to_delete')
          });
        }
      }
    });
  }
}
