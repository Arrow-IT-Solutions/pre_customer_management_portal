import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { SettingRequest, SettingUpdateRequest } from '../../settings/settings.module';
import { SettingsService } from 'src/app/layout/service/settings.service';

@Component({
  selector: 'app-add-setting',
  templateUrl: './add-setting.component.html',
  styleUrls: ['./add-setting.component.scss'],
  providers: [MessageService]
})
export class AddSettingComponent {
  dataForm!: FormGroup;
  submitted: boolean = false;
  btnLoading: boolean = false;
  loading: boolean = false;
  fileLogo: any;
  fileBackground: any;
  fileInput: any;
  fileInputLogo: any;
  fileInputBackground: any;
  logo: boolean = true;
  background: boolean = true;
  constructor(public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    public settingService: SettingsService,
    public messageService: MessageService
  ) {
    this.dataForm = this.formBuilder.group({
      appUrl: [''],
      phone: [''],
      nameAr: [''],
      nameEn: [''],
      subtitleAr: [''],
      subtitleEn: [''],
      facebookLink: [''],
      instagramLink: ['']

    })

  }
  async ngOnInit() {
    try {
      this.loading = true;

      if (this.settingService.SelectedData != null) {
        console.log(this.settingService.SelectedData)
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

    var settingTranslation = [
      {
        name: this.dataForm.controls['nameAr'].value.toString(),
        language: 'ar'
      },
      {
        name: this.dataForm.controls['nameEn'].value == null ? '' : this.dataForm.controls['nameEn'].value.toString(),
        language: 'en'
      }
    ];

    if (this.settingService.SelectedData != null) {
      // update

      var setting: SettingUpdateRequest = {
        uuid: this.settingService.SelectedData?.uuid?.toString(),
        appURL: this.dataForm.controls['appUrl'].value.toString(),
        settingTranslation: settingTranslation,
        phone: this.dataForm.controls['phone'].value.toString(),
        logo: this.fileLogo,
        backgroundImage: this.fileBackground,
        instagramLink: this.dataForm.controls['instagramLink'].value.toString(),
        facebookLink: this.dataForm.controls['facebookLink'].value.toString()
      };
      console.log(setting)
      response = await this.settingService.Update(setting);
    } else {
      // add
      var addsetting: SettingRequest = {
        settingTranslation: settingTranslation,
        appURL: this.dataForm.controls['appUrl'].value.toString(),
        phone: this.dataForm.controls['phone'].value.toString(),
        logo: this.fileLogo,
        backgroundImage: this.fileBackground,
        instagramLink: this.dataForm.controls['instagramLink'].value.toString(),
        facebookLink: this.dataForm.controls['facebookLink'].value.toString()


      };

      console.log('add', addsetting)

      response = await this.settingService.Add(addsetting);
    }

    if (response?.requestStatus?.toString() == '200') {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response?.requestMessage);

      if (this.settingService.SelectedData == null) {
        this.resetForm();

      } else {
        this.settingService.Dialog.Close();
      }
    } else {
      this.layoutService.showError(this.messageService, 'toast', true, response?.requestMessage);
    }

    this.btnLoading = false;
    this.submitted = false;
  }

  async FillData() {
    let temp = {
      appUrl: this.settingService.SelectedData?.appURL,
      phone: this.settingService.SelectedData?.phone,
      nameAr: this.settingService.SelectedData?.settingTranslation!['ar'].name,
      nameEn: this.settingService.SelectedData?.settingTranslation!['en'].name,
      subtitleAr: this.settingService.SelectedData?.settingTranslation!['ar'].subtitle,
      subtitleEn: this.settingService.SelectedData?.settingTranslation!['en'].subtitle,
      facebookLink: this.settingService.SelectedData?.facebookLink,
      instagramLink: this.settingService.SelectedData?.instagramLink
    };
    this.fileInputLogo = this.settingService.SelectedData?.logo,
      this.logo = false
    this.fileInputBackground = this.settingService.SelectedData?.backgroundImage,
      this.background = false

    this.dataForm.patchValue(temp);

  }

  resetForm() {
    this.dataForm.reset();
  }

  OnSelectFileLogo(file) {
    this.fileLogo = file;
    this.logo = false;
  }

  OnSelectFileBackground(file) {
    this.fileBackground = file;
    this.background = false;
  }
}
