import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DataBasesService } from 'src/app/layout/service/databases.service';
import { LayoutService } from 'src/app/layout/service/layout.service';

@Component({
  selector: 'app-add-database',
  templateUrl: './add-database.component.html',
  styleUrls: ['./add-database.component.scss'],
  providers: [MessageService]
})
export class AddDatabaseComponent {
        dataForm!: FormGroup;
        submitted: boolean = false;
        btnLoading: boolean = false;
        loading: boolean = false;
        constructor(public formBuilder:FormBuilder,
          public messageService: MessageService,
          public database:DataBasesService,
          public layoutService: LayoutService,
  
        ){
          this.dataForm=this.formBuilder.group({
            nameEn:['',Validators.required],
            nameAr:['',Validators.required],
            userName:['',Validators.required],
            
          })
        }
        get form(): { [key: string]: AbstractControl } {
        return this.dataForm.controls;
      }
       async ngOnInit() {}
       async onSubmit() {}
       async Save() {}

}
