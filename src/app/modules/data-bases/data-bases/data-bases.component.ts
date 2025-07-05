import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DataBasesService } from 'src/app/layout/service/databases.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddDatabaseComponent } from '../add-database/add-database.component';

@Component({
  selector: 'app-data-bases',
  templateUrl: './data-bases.component.html',
  styleUrls: ['./data-bases.component.scss'],
  providers: [MessageService]
})
export class DataBasesComponent {
  dataForm!: FormGroup;
    loading = false;
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
      public translate: TranslateService,public database:DataBasesService) {
      this.dataForm=this.formBuilder.group({
        name:[''],
        UserName:['']
  
      })
    }
  
    async FillData() {
  
    }
  
    async ngOnInit() {
  
      await this.FillData();
  
      }
  
  
      async resetform() {
      this.dataForm.reset();
      await this.FillData();
    }
    paginate(event: any) {
      this.pageSize = event.rows
      this.first = event.first
  
    }
    openAdddatabase(){
       window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      let content = this.database.SelectedData == null ? 'Create_DataBase' : 'Update_DataBase';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
      var component = this.layoutService.OpenDialog(AddDatabaseComponent, content);
      this.database.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.FillData();
      });
    }

}
