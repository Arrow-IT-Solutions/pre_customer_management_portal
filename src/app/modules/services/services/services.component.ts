import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddServiceComponent } from '../add-service/add-service.component';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { ServicesService } from 'src/app/layout/service/services.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  providers: [MessageService]
})
export class ServicesComponent {
  dataForm!: FormGroup;
  loading = false;
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
    public translate: TranslateService,public services:ServicesService) {
    this.dataForm=this.formBuilder.group({
      name:[''],
      description:['']

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
  openAddService(){
     window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    let content = this.services.SelectedData == null ? 'Create_Service' : 'Update_Service';
    this.translate.get(content).subscribe((res: string) => {
      content = res
    });
    var component = this.layoutService.OpenDialog(AddServiceComponent, content);
    this.services.Dialog = component;
    component.OnClose.subscribe(() => {
      document.body.style.overflow = '';
      this.FillData();
    });
  }
}
