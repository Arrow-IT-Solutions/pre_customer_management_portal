import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { AuthGuardService } from './Core/guard/auth-guard.service';
import { ContentLayoutAdminComponent } from './layout/content-layout-admin/content-layout-admin.component';


const routes: Routes = [

  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  // {
  //   path: 'home',
  //   children: [{
  //     path: '',
  //     loadChildren: () =>
  //       import('./modules/gate/gate.module').then(
  //         (m) => m.GateModule
  //       )
  //   }],
  // },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    //import('./modules/gate/gate.module').then((m) => m.GateModule),
  },
  {
    path: 'layout-admin',
    component: ContentLayoutAdminComponent,
    // canActivate: [AuthGuardService],
    children: [
      {
        path: 'services',
        loadChildren: () =>
          import('./modules/services/services.module').then(
            (m) => m.ServicesModule
          )
      },
       {
      path: 'environments',
      loadChildren: () =>
        import('./modules/environment/environment.module').then(
          (m) => m.EnvironmentModule
        )
    },
      {
        path: 'DataBases',
        loadChildren: () =>
          import('./modules/data-bases/data-bases.module').then(
            (m) => m.DataBasesModule
          )
      },
      {
        path: 'servers',
        loadChildren: () =>
          import('./modules/servers/servers.module').then(
            (m) => m.ServersModule
          )
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./modules/companies/companies.module').then(
            (m) => m.CompaniesModule
          )
      },
       {
        path: 'ports',
        loadChildren: () =>
          import('./modules/ports/port.module').then(
            (m) => m.PortModule
          )
      },
       {
        path: 'applications',
        loadChildren: () =>
          import('./modules/applications/application.module').then(
            (m) => m.ApplicationModule
          )
      },
      {
        path: 'credential',
        loadChildren: () =>
          import('./modules/credential/credential.module').then(
            (m) => m.CredentialModule
          )
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('./modules/subscription/subscription.module').then(
            (m) => m.SubscriptionModule
          )
      },

      {
        path: 'add',
        loadChildren: () =>
          import('./modules/wizard-to-add/wizard-to-add.module').then(
            (m) => m.WizardToAddModule
          )
      },
      {
        path: 'company-services',
        loadChildren: () =>
          import('./modules/company-service/company-service.module').then(
            (m) => m.CompanyServiceModule
          )
      },

       {
        path: 'add-server',
        loadChildren: () =>
          import('./modules/wizard-add-server/wizard-add-server.module').then(
            (m) => m.WizardAddServerModule
          )
      },
     



      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            (m) => m.SettingsModule
          )
      }

    ]
  },



  // { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
