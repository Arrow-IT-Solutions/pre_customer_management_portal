import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LocalService } from '../../../../shared/service/local.service';
import { LayoutService } from '../../../../layout/service/layout.service';
import { UserService } from '../../../../Core/services/user.service';
import { AuthService } from 'src/app/Core/services/auth.service';
import { AuthRequest, CurrentUser } from '../../auth.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('UserName', { static: false }) emailElement: ElementRef | any;
  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(public formBuilder: FormBuilder, public router: Router, public localService: LocalService, public layoutService: LayoutService, public messageService: MessageService, public userService: UserService, public authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }
  get form(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  ngAfterViewInit() {
    // this.emailElement.nativeElement.focus();
  }

  public onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        break;
      case 'Enter':
        this.onSubmit();
        break;
      case 'Tab':
        break;
    }
  }

  async onSubmit() {
    try {
      this.loading = true;

      if (this.loginForm.invalid) {
        this.submitted = true;
        return;
      }

      await this.Save();
    } catch (exceptionVar) {
    } finally {
      this.loading = false;
    }
  }

  async Save() {
    var authRequest: AuthRequest = {
      userName: this.loginForm.controls['UserName'].value,
      password: this.loginForm.controls['Password'].value,
      platformType: '0'
    };

    const response = await this.authService.Auth(authRequest);

    console.log('authResponse : ', response);

    if (response.requestStatus == 200) {
      this.layoutService.showSuccess(this.messageService, 'toast', true, response.requestMessage);


      this.userService.currentUser = {
        userUUID: response.uuid,
        userName: response.userName,
        userType: response.userType,
        token: response.token,
        loggedInUser: response.userLoggedIn
      };

      this.layoutService.config = {
        dir: 'ltr',
        lang: 'en'
      }

      this.localService.saveData('currentUser', JSON.stringify(this.userService.currentUser));
      this.localService.saveData('lang', "en");
      this.localService.saveData('dir', "ltr");

      switch (response.userType) {
        case '0':
          this.router.navigateByUrl('layout-admin/companies'); // admin or user
          break;

        case '1':
          this.router.navigateByUrl('layout-admin/companies'); // cashier
          break;
      }

      // this.router.navigateByUrl('merchants');
    } else {
      console.log('errrrror');

      this.layoutService.showError(this.messageService, 'toast', true, response.requestMessage);
    }

    this.submitted = false;
    this.loading = false;


  }

  goToSignUp() {
    this.router.navigate(['/auth/sign-up']);
  }
}
