import { Component } from '@angular/core';
import { AddCredentialComponent } from '../add-credential/add-credential.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { CredentialService } from 'src/app/layout/service/credential.service';

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.scss']
})
export class CredentialComponent {
      dataForm!: FormGroup;
      loading = false;
      pageSize: number = 12;
      first: number = 0;
      totalRecords: number = 0;
      constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
        public translate: TranslateService,public credential:CredentialService) {
        this.dataForm=this.formBuilder.group({
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
      openAddcredential(){
         window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.style.overflow = 'hidden';
        let content = this.credential.SelectedData == null ? 'Create_Credential' : 'Update_Credential';
        this.translate.get(content).subscribe((res: string) => {
          content = res
        });
        var component = this.layoutService.OpenDialog(AddCredentialComponent, content);
        this.credential.Dialog = component;
        component.OnClose.subscribe(() => {
          document.body.style.overflow = '';
          this.FillData();
        });
      }
  

}
