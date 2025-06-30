import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './page/login/login.component';



const routes: Routes = [

  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      // {
      //   path: 'reset-password',
      //   component: ResetPasswordComponent,
      // },
      // {
      //   path: 'sign-up',
      //   component: SignUpComponent,
      // },
      // {
      //   path: 'get-started',
      //   component: GetStertedComponent,
      // },
      // {
      //   path: 'one-last-step',
      //   component: OneLastStepComponent,
      // },
      // {
      //   path: 'forget-password',
      //   component: ForgetPasswordComponent,
      // },
      // {
      //   path: 'security-code',
      //   component: SecurityCodeComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
