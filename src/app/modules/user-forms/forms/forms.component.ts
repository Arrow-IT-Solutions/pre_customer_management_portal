import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ConstantResponse } from 'src/app/Core/services/constant.service';
import { ConstantService } from 'src/app/Core/services/constant.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {
  monthOptions: SelectItem[] = Array.from({ length: 12 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));

  dayOptions: SelectItem[] = Array.from({ length: 31 }, (_, i) => ({
    key: i + 1,
    value: (i + 1).toString(),
  }));

  dataForm!: FormGroup;
  btnLoading: boolean = false;
  unCurrentlang: string;
  currentlang: string;
  langCode: string;
  formUuid: string;
  martialStatus: ConstantResponse[] = [];
  submitted: boolean = false;
  constructor(public formBuilder: FormBuilder,
    public layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document,
    public route: ActivatedRoute,
    private router: Router,
    public constantService: ConstantService) {
    this.dataForm = this.formBuilder.group({
      userName: ['', Validators.required],
      maritalStatus: [null, Validators.required],
      countryCode: [null, Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      country: ['', Validators.required],
      info: ['', Validators.required],
      sendOffers: [null, Validators.required],
      year: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      month: [null, Validators.required],
      day: [null, Validators.required],

    })

  }


  async ngOnInit() {
    this.formUuid = this.route.snapshot.paramMap.get('uuid')!;
    const maritalStatus = await this.constantService.Search('SocialStatus') as any;
    this.martialStatus = maritalStatus.data;
    this.checkCurrentLang();

  }


  changeLang(lang: string) {

    if (lang == 'ar') {
      this.currentlang = "English"
      this.layoutService.config =
      {
        dir: 'ltr',
        lang: 'en'
      }

    }
    else if (lang == 'en') {
      this.currentlang = "عربي"
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

  checkCurrentLang() {
    const lang = localStorage.getItem('lang');

    if (lang === 'en') {
      this.currentlang = "English";
      this.unCurrentlang = "عربي";
      this.langCode = "en"
    } else if (lang === 'ar') {
      this.currentlang = "Arabic";
      this.unCurrentlang = "English";
      this.langCode = "ar"
    }
  }
}
