import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServicesService } from 'src/app/layout/service/services.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
  providers: [MessageService]
})
export class AddServiceComponent {
      dataForm!: FormGroup;
      submitted: boolean = false;
      btnLoading: boolean = false;
      loading: boolean = false;
      constructor(public formBuilder:FormBuilder,
        public messageService: MessageService,
        public service: ServicesService,
        public layoutService: LayoutService,

      ){
        this.dataForm=this.formBuilder.group({
          nameEn:['',Validators.required],
          nameAr:['',Validators.required],
          descAr:['',Validators.required],
          descEn:['',Validators.required]
        })
      }
      get form(): { [key: string]: AbstractControl } {
      return this.dataForm.controls;
    }
     async ngOnInit() {}
     async onSubmit() {}
     async Save() {}

}
