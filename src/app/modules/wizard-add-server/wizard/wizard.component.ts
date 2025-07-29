import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ServersService } from 'src/app/layout/service/servers.service';
import { WizardStep } from 'src/app/shared/models/wizrd-step';
import { ServerComponent } from '../server/server.component';
import { ApplicationComponent } from '../application/application.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})

export class WizardComponent implements OnInit, OnDestroy {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;
  private routerSub!: Subscription;

  items: MenuItem[];
  activeIndex = 0;

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private serverService: ServersService) { }

  ngOnInit() {

    // Clear when *leaving* the wizard URL
    this.routerSub = this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        const path = evt.urlAfterRedirects.toLowerCase();
        if (!path.includes('/add-server/')) {
          sessionStorage.removeItem('wizardServer');
          sessionStorage.removeItem('wizardApps');
          this.serverService.serverHelper = null as any;
          this.serverService.SelectedData = null as any;
        }
      }
    });
    this.items = [
      {
        label: this.isAr() ? 'المخدم' : 'Server',
        command: (event) => this.onStepClick(0, 'server-data')
      },

      {
        label: this.isAr() ? 'التطبيق' : 'Application',
        command: (event) => this.onStepClick(1, 'application')
      },
    ];
    this.syncActiveIndex();
  }

  private syncActiveIndex() {
    this.activeIndex = this.router.url.includes('application') ? 1 : 0;
  }

  private async onStepClick(stepIndex: number, routePath: string) {

    // no‑op if you click the tab you’re already on
    if (stepIndex === this.activeIndex) {
      return;
    }
    const comp = this.outlet.component as WizardStep;

    if (stepIndex > this.activeIndex) {
      // moving forward: validate & save current step
      if (!comp.validate()) {
        return;
      }
    } else if (stepIndex < this.activeIndex) {
      // moving back: allow current to save its data
      comp.saveData();
    }

    this.activeIndex = stepIndex;
    this.saveCurrentPageData();
    this.router.navigate([`layout-admin/add-server/${routePath}`]);
  }

  isAr(): boolean {
    if (this.layoutService.config.lang == 'ar') {
      return true;
    } else {
      return false;
    }
  }

  private async saveCurrentPageData() {
    const h = this.serverService.serverHelper;
    if (h) {
      sessionStorage.setItem(
        'wizardServer',
        JSON.stringify({ ...h, timestamp: Date.now() })
      );
    }
  }

  private clearWizardData() {
    sessionStorage.removeItem('wizardServer');
    sessionStorage.removeItem('wizardApps');

  }

  finishWizard() {
    this.clearWizardData();
    this.router.navigate(['/layout-admin/servers']);
  }

  cancelWizard() {
    this.clearWizardData();
    this.router.navigate(['/layout-admin/servers']);
  }

  ngOnDestroy() {
    this.serverService.finish();

  }
}

