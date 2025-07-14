import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss'],
  providers: [MessageService]
})
export class EnvironmentComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  isPasswordVisible: boolean = false;
   constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public layoutService: LayoutService,
    public messageService: MessageService,
    ) {
    this.dataForm = formBuilder.group({
     nameEnvEn:['',Validators.required],
     nameEnvAr:['',Validators.required],
     urlEnv:['',Validators.required],
     server:['',Validators.required],
     databaseName:['',Validators.required],
     userName:['',Validators.required],
     password:['',Validators.required]
   
    });

  }
  get form(): { [key: string]: AbstractControl } {
    return this.dataForm.controls;
  }

  async onSubmit() {
    console.log('onSubmit dataform : ', this.dataForm);
    
  }

     
  resetForm() {
  this.dataForm.reset();
  }

   togglePasswordVisibility(): void {
  this.isPasswordVisible = !this.isPasswordVisible;
  }
  
  back(){
    this.router.navigate(['layout-admin/add/customer-service']);
  }
}
