import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ApplicationRequest, ApplicationUpdateRequest } from '../application.module';
import { ApplicationService } from 'src/app/layout/service/application.service';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss'],
  providers: [MessageService]
})
export class AddApplicationComponent {
    @Input() prefillValue: { optionEn: string, optionAr: string, uuid?: string } | null = null;
    static refreshOptionsCallback: (() => void) | null = null;

      dataForm!: FormGroup;
      submitted: boolean = false;
      btnLoading: boolean = false;
      loading: boolean = false;
      file: any;
      fileInput: any
      img: boolean = true;
      constructor(public formBuilder:FormBuilder,
        public messageService: MessageService,
        public applicationService: ApplicationService,
        public layoutService: LayoutService,

      ){
        this.dataForm=this.formBuilder.group({
          appEn:['',Validators.required],
          appAr:['',Validators.required],
          url:['',Validators.required]

        })
      }
      get form(): { [key: string]: AbstractControl } {
      return this.dataForm.controls;
    }

  async ngOnInit() {
    try {
      this.loading = true;

      if (this.applicationService.SelectedData != null) {
        await this.FillData();
      }
    } catch (exceptionVar) {
      console.log(exceptionVar);
    } finally {
      this.loading = false;
    }
  }

      async onSubmit() {
 try {
      this.btnLoading = true;

      if (this.dataForm.invalid) {
        this.submitted = true;
        return;
      }
      await this.Save();
    } catch (exceptionVar) {
    } finally {
      this.btnLoading = false;
    }
      }

      async Save() {
          let response;

            var applicationTranslation = [
              {
                name: this.dataForm.controls['appAr'].value == null ? '' : this.dataForm.controls['appAr'].value.toString(),
                language: 'ar'
              },
              {
                name: this.dataForm.controls['appEn'].value == null ? '' : this.dataForm.controls['appEn'].value.toString(),
                language: 'en'
              }
            ];

            if (this.applicationService.SelectedData != null) {
              // update
              var updateForm: ApplicationUpdateRequest = {
                uuid: this.applicationService.SelectedData?.uuid?.toString(),
                applictionTranslations: applicationTranslation,
                url: this.dataForm.controls['url'].value,
                icon: this.file
              };
              console.log(updateForm)
              response = await this.applicationService.Update(updateForm);
            } else {
              // add
              var addForm: ApplicationRequest = {
                applictionTranslations: applicationTranslation,
                url: this.dataForm.controls['url'].value,
                icon: this.file

              };

              console.log(addForm)

              response = await this.applicationService.Add(addForm);
            }

      if (response?.requestStatus?.toString() == '200') {
        this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);
        setTimeout(() => {
          if ((this.constructor as any).refreshOptionsCallback) {
            (this.constructor as any).refreshOptionsCallback();
            (this.constructor as any).refreshOptionsCallback = null;
          }
          if (this.applicationService.Dialog && typeof this.applicationService.Dialog.Close === 'function') {
            this.applicationService.Dialog.Close();
          }
          this.applicationService.SelectedData = null;
        }, 600);
        if (this.applicationService.SelectedData == null) {
          this.resetForm();
        }
      } else {
        this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
      }

            this.btnLoading = false;
            this.submitted = false;
      }

      resetForm() {
      this.dataForm.reset();
    }
      FillData(){
      let temp = {
        appAr: this.applicationService.SelectedData?.applictionTranslations!['ar'].name,
        appEn: this.applicationService.SelectedData?.applictionTranslations!['en'].name,
        icon: this.applicationService.SelectedData?.icon,
        url: this.applicationService.SelectedData?.url
      };
      this.fileInput = this.applicationService.SelectedData?.icon,
      this.img = false
      this.dataForm.patchValue(temp);
    }

  OnSelectFile(file) {
    this.file = file;
    this.img = false;
  }



}
