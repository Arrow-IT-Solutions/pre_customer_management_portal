import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-add-subscripe',
  templateUrl: './add-subscripe.component.html',
  styleUrls: ['./add-subscripe.component.scss'],
  providers: [MessageService]
})
export class AddSubscripeComponent {
        dataForm!: FormGroup;
        submitted: boolean = false;
        btnLoading: boolean = false;
        loading: boolean = false;
        constructor(public formBuilder:FormBuilder,
          public messageService: MessageService,
          public layoutService: LayoutService,
  
        ){
          this.dataForm=this.formBuilder.group({
            startDate:['',Validators.required],
            endDate:['',Validators.required],
            status:['',Validators.required],
          })
        }
        get form(): { [key: string]: AbstractControl } {
        return this.dataForm.controls;
      }
       async ngOnInit() {}
       async onSubmit() {}
       async Save() {}

}
