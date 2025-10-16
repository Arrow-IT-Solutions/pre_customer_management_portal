import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-renews',
  templateUrl: './renews.component.html',
  styleUrls: ['./renews.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class RenewsComponent {
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    visible: boolean = false;
    dataForm!: FormGroup;
    loading = false;
    isResetting: boolean = false;
    doneTypingInterval = 1000;
    typingTimer: any;
  
    constructor(
      public formBuilder: FormBuilder,
      public translate: TranslateService,
      public layoutService: LayoutService,
      public messageService: MessageService,
      public confirmationService: ConfirmationService
    ) {
      this.dataForm = this.formBuilder.group({
      com_name: [''],
      startDate: ['', ],
      endDate: ['', ],
      type_period:['']
      
  });

    }
  
    async ngOnInit() {
      await this.FillData();
    }
     Search() {
      this.FillData();
    }
  
    async FillData(pageIndex: number = 0) {
     
    }
  
  
  async confirmDelete() {
      
    }
  
    
  
    async resetform() {
      this.isResetting = true;
      this.dataForm.reset();
      await this.FillData();
      this.isResetting = false;
    }
  
      paginate(event: any) {
      this.pageSize = event.rows
      this.first = event.first
      this.FillData(event.first)
  
    }
  
  
  
     OnChange() {
      if (this.isResetting) { return }; 
  
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.FillData();
      }, this.doneTypingInterval);
  
    }
  
    showDialog(link: string) {
      
      this.visible = true;
    }

}
