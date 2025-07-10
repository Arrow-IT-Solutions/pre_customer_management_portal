import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.scss'],
  providers: [MessageService]
})
export class DefinitionsComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
   constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public layoutService: LayoutService,
    public messageService: MessageService,
    ) {
    this.dataForm = formBuilder.group({
      customerName: ['', Validators.required],
      service: ['', Validators.required],
   
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
  nextStep(){
  this.router.navigate(['layout-admin/add/subscription']);
  }

}
