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
  // {
  //   path: 'auth',
  //   component: AuthLayoutComponent,
  //   loadChildren: () =>
  //     import('./modules/auth/auth.module').then((m) => m.AuthModule),
  //   //import('./modules/gate/gate.module').then((m) => m.GateModule),
  // },
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
