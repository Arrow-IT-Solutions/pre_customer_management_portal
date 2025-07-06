import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CustomersService } from 'src/app/layout/service/customers.service';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  providers: [MessageService]
})
export class AddCustomerComponent {
        dataForm!: FormGroup;
        submitted: boolean = false;
        btnLoading: boolean = false;
        loading: boolean = false;
        constructor(public formBuilder:FormBuilder,
          public messageService: MessageService,
          public customer: CustomersService,
          public layoutService: LayoutService,
  
        ){
          this.dataForm=this.formBuilder.group({
            nameEn:['',Validators.required],
            nameAr:['',Validators.required],
            primaryContact:['',Validators.required],
            email:['',Validators.required],
            countryCode:['',Validators.required],
            phone:['',Validators.required],
            anyDeskAddress:['',Validators.required]
          })
        }
        get form(): { [key: string]: AbstractControl } {
        return this.dataForm.controls;
      }
       async ngOnInit() {}
       async onSubmit() {}
       async Save() {}

}
