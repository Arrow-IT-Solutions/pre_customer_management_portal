import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { AddSubscripeComponent } from '../add-subscripe/add-subscripe.component';
import { SubscripeService } from 'src/app/layout/service/subscriptions.sevice';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {

   dataForm!: FormGroup;
    loading = false;
    pageSize: number = 12;
    first: number = 0;
    totalRecords: number = 0;
    constructor(public formBuilder:FormBuilder,public layoutService: LayoutService,
      public translate: TranslateService,public subscripe:SubscripeService) {
      this.dataForm=this.formBuilder.group({
        status:[''],
  
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
      let content = this.subscripe.SelectedData == null ? 'Create_Subscripe' : 'Update_Subscripe';
      this.translate.get(content).subscribe((res: string) => {
        content = res
      });
      var component = this.layoutService.OpenDialog(AddSubscripeComponent, content);
      this.subscripe.Dialog = component;
      component.OnClose.subscribe(() => {
        document.body.style.overflow = '';
        this.FillData();
      });
    }
}
