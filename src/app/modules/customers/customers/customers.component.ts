import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomersService } from 'src/app/layout/service/customers.service';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [MessageService]
})
export class CustomersComponent {
      dataForm!: FormGroup;
      loading = false;
      pageSize: number = 12;
      first: number = 0;
      totalRecords: number = 0;
      constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
        public translate: TranslateService,public customer:CustomersService) {
        this.dataForm=this.formBuilder.group({
          name:[''],
          primaryContact:[''],
          email:[''],
          phone:[''],
          anyDeskAddress:['']
    
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
      openAddcustomer(){
         window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.style.overflow = 'hidden';
        let content = this.customer.SelectedData == null ? 'Create_DataBase' : 'Update_DataBase';
        this.translate.get(content).subscribe((res: string) => {
          content = res
        });
        var component = this.layoutService.OpenDialog(AddCustomerComponent, content);
        this.customer.Dialog = component;
        component.OnClose.subscribe(() => {
          document.body.style.overflow = '';
          this.FillData();
        });
      }
  


}
