import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss'],
  providers: [MessageService]
})
export class VariantsComponent {
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
        server: ['', Validators.required],
        databaseName: ['', Validators.required],
        userName: ['', Validators.required],
        password: ['', Validators.required],
      });
  
    }
    get form(): { [key: string]: AbstractControl } {
      return this.dataForm.controls;
    }
  
    async onSubmit() {
      console.log('onSubmit dataform : ', this.dataForm);
      
    }
  
       async Save() {}
       resetForm() {
      this.dataForm.reset();
    }
     togglePasswordVisibility(): void {
           this.isPasswordVisible = !this.isPasswordVisible;
     }

}
