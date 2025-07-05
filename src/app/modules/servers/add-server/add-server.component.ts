import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServersService } from 'src/app/layout/service/servers.service';

@Component({
  selector: 'app-add-server',
  templateUrl: './add-server.component.html',
  styleUrls: ['./add-server.component.scss'],
  providers: [MessageService]
})
export class AddServerComponent {
        dataForm!: FormGroup;
        submitted: boolean = false;
        btnLoading: boolean = false;
        loading: boolean = false;
        constructor(public formBuilder:FormBuilder,
          public messageService: MessageService,
          public server: ServersService,
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
