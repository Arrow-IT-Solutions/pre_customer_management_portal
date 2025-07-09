import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { PortService } from 'src/app/layout/service/ports.service';

@Component({
  selector: 'app-add-port',
  templateUrl: './add-port.component.html',
  styleUrls: ['./add-port.component.scss'],
  providers: [MessageService]
})
export class AddPortComponent {
        dataForm!: FormGroup;
        submitted: boolean = false;
        btnLoading: boolean = false;
        loading: boolean = false;
        constructor(public formBuilder:FormBuilder,
          public messageService: MessageService,
          public port: PortService,
          public layoutService: LayoutService,
  
        ){
          this.dataForm=this.formBuilder.group({
            hostName:['',Validators.required],
            IpAddress:['',Validators.required],
           
          })
        }
        get form(): { [key: string]: AbstractControl } {
        return this.dataForm.controls;
      }
       async ngOnInit() {}
       async onSubmit() {}
       async Save() {}

}
