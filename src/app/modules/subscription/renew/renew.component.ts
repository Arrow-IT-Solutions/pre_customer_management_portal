import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-renew',
  templateUrl: './renew.component.html',
  styleUrls: ['./renew.component.scss'],
  providers: [MessageService]
})
export class RenewComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  
    constructor(public formBuilder: FormBuilder,
      public messageService: MessageService,
      public layoutService: LayoutService,
   
    ) {
      this.dataForm = this.formBuilder.group({
        period_number: ['', [Validators.required,this.integerValidator()]],
        period_type: ['', Validators.required],
      
      })
    }
    get form(): { [key: string]: AbstractControl } {
      return this.dataForm.controls;
    }
    async ngOnInit() {
      
    }
  
    async onSubmit() {
    
    }
  
    async Save() {
  
      
    }
  
    resetForm() {
      this.dataForm.reset();
    }
    integerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isInteger = Number.isInteger(Number(value)); // Check if the value is an integer
      return isInteger ? null : { 'notInteger': { value } }; // Return an error object if not an integer
    };
  }

}
