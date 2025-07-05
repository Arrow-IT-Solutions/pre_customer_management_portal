import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { AddServerComponent } from '../add-server/add-server.component';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent {
  dataForm!: FormGroup;
    loading = false;
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
      public translate: TranslateService,public servers:ServersService) {
      this.dataForm=this.formBuilder.group({
        hostName:[''],
        IpAddress:['']
  
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
    openAddServer(){
       window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      let content = this.servers.SelectedData == null ? 'Create_Server' : 'Update_Server';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
      var component = this.layoutService.OpenDialog(AddServerComponent, content);
      this.servers.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.FillData();
      });
    }

}
