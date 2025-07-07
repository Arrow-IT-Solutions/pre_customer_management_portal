import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CredentialService } from 'src/app/layout/service/credential.service';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-add-credential',
  templateUrl: './add-credential.component.html',
  styleUrls: ['./add-credential.component.scss'],
  providers: [MessageService]
})
export class AddCredentialComponent {
          dataForm!: FormGroup;
          submitted: boolean = false;
          btnLoading: boolean = false;
          loading: boolean = false;
          isPasswordVisible: boolean = false;
          constructor(public formBuilder:FormBuilder,
            public messageService: MessageService,
            public credential:CredentialService,
            public layoutService: LayoutService,
    
          ){
            this.dataForm=this.formBuilder.group({
              nameEn:['',Validators.required],
              nameAr:['',Validators.required],
              userName:['',Validators.required],
              password:['',Validators.required]
              
            })
          }
          get form(): { [key: string]: AbstractControl } {
          return this.dataForm.controls;
          }
           togglePasswordVisibility(): void {
             this.isPasswordVisible = !this.isPasswordVisible;
                   }
  
  
         async ngOnInit() {}
         async onSubmit() {}
         async Save() {}
  

}
