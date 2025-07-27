import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent {
   dataForm!: FormGroup;
   submitted: boolean = false;
   btnLoading: boolean = false;
   loading: boolean = false;
   isPasswordVisible: boolean = false;
  
  constructor(
      public formBuilder: FormBuilder,
      public router: Router,
      public route: ActivatedRoute,
      public layoutService: LayoutService,
      public messageService: MessageService){
        this.dataForm=formBuilder.group({
          localIpAdd:['',Validators.required],
          publicIpAdd:['',Validators.required],
          userName:[''],
          password:['']
        });


  }
   get form(): { [key: string]: AbstractControl } {
            return this.dataForm.controls;
   }

  async onSubmit() {
    console.log('onSubmit dataform : ', this.dataForm);

  }

  async ngOnInit() {}


   nextStep() {
      this.router.navigate(['layout-admin/add-server/application']);
    }
    togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
   

     
}


