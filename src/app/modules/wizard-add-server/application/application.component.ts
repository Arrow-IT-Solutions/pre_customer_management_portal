import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {
   dataForm!: FormGroup;
   searchForm!:FormGroup;
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
         appName: ['', Validators.required],
         port: ['', Validators.required],
         url: ['', Validators.required],
         userName: [''],
         password: [''],
         
   
       });
   
       this.searchForm=formBuilder.group({
         searchAppName:[''],
         searchPort:[''],
         
   
   
       })
      }

        get form(): { [key: string]: AbstractControl } {
          return this.dataForm.controls;
        }
      
    async ngOnInit() {}
    async onSubmit() {
    try {
      this.btnLoading = true;
      this.loading = true;
      

      await this.Save();

    } catch (exceptionVar) {
      this.btnLoading = false;
      this.loading = false;
    }
    this.loading = false;
  }
   OnChange() {}

  async Save() {}
  resetForm() {
   
  }

  resetSearchForm(){}

  clearForm() {
    this.loading = true;

    this.dataForm.reset();
    
    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
