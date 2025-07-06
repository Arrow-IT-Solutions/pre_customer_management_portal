import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { PortsService } from 'src/app/layout/service/ports.service';
import { AddPortComponent } from '../add-port/add-port.component';

@Component({
  selector: 'app-ports',
  templateUrl: './ports.component.html',
  styleUrls: ['./ports.component.scss']
})
export class PortsComponent {
    dataForm!: FormGroup;
    loading = false;
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
      public translate: TranslateService,public port:PortsService) {
      this.dataForm=this.formBuilder.group({
        number:[''],
        
  
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
    openAddport(){
       window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
      let content = this.port.SelectedData == null ? 'Create_port' : 'Update_port';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
      var component = this.layoutService.OpenDialog(AddPortComponent, content);
      this.port.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.FillData();
      });
    }
}
