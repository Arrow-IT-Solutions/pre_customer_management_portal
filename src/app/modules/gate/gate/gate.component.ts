import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ApplicationService } from 'src/app/layout/service/application.service';
import { ApplicationResponse, ApplicationSearchRequest } from '../../application/application.module';
import { SettingsService } from 'src/app/layout/service/settings.service';
import { SettingResponse, SettingSearchRequest } from '../../settings/settings.module';
@Component({
  selector: 'app-gate',
  templateUrl: './gate.component.html',
  styleUrls: ['./gate.component.scss']
})
export class GateComponent {
  setting: SettingResponse;
  loading = false;
  pageSize: number = 12;
  first: number = 0;
  totalRecords: number = 0;
  data: ApplicationResponse[] = [];
  formTotal: number = 0;
  doneTypingInterval = 1000;
  typingTimer: any;
  isResetting: boolean = false;
  constructor(public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    public applicationService: ApplicationService,
    public settingService: SettingsService,) {

  }

  async ngOnInit() {
    // this.checkCurrentLang();
    await this.FillData();
    await this.RetriveSettings()
  }

  changeLang(lang: string) {
    console.log("current Lang : ", lang);

    if (lang == 'en') {

      this.layoutService.config =
      {
        dir: 'ltr',
        lang: 'en'
      }

    }
    else if (lang == 'ar') {
      this.layoutService.config =
      {
        dir: 'rtl',
        lang: 'ar'
      }
    }

    localStorage.setItem('lang', this.layoutService.config.lang);
    localStorage.setItem('dir', this.layoutService.config.dir);
    this.document.documentElement.lang = this.layoutService.config.lang;

    window.location.reload();
  }

  async FillData(pageIndex: number = 0) {
    this.loading = true;
    this.data = [];
    this.formTotal = 0;
    let filter: ApplicationSearchRequest = {
      uuid: '',
      name: '',
      pageIndex: pageIndex.toString(),
      pageSize: '1000',
    };

    const response = (await this.applicationService.Search(filter)) as any;
    console.log('data', response)
    if (response.data == null || response.data.length == 0) {
      this.data = [];
      this.formTotal = 0;
    } else if (response.data != null && response.data.length != 0) {
      this.data = response.data;
      this.formTotal = response.data[0];
    }

    this.totalRecords = response.totalRecords;

    this.loading = false;

  }
  //  checkCurrentLang() {
  //   if(this.layoutService.config.lang == 'en')
  //     {
  //       this.currentlang = "English"


  //     }
  //     else if( this.layoutService.config.lang == 'ar')
  //     {
  //       this.currentlang = "عربي"

  //     }
  // }

  Redirect(row: ApplicationResponse | null = null) {
    const url = row?.url?.trim();
    if (!url) {
      // nothing to open
      return;
    }

    // ensure it has a protocol
    const safeUrl = /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;

    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  }

  async RetriveSettings() {


    let filter: SettingSearchRequest = {

      name: '',
      uuid: '',
      pageIndex: "",
      pageSize: '100000'

    }
    const response = await this.settingService.Search(filter) as any

    this.setting = response.data[0];


  }
}
