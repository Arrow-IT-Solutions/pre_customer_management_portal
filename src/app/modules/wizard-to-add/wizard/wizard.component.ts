import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnDestroy {
  items: MenuItem[];
  activeIndex = 0;
  private navigationSubscription?: Subscription;

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
    private provisionedService: ProvisionedService
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: this.isAr() ? 'خدمة العملاء' : 'Customer Service',
        command: (event) => this.onStepClick(0, 'customer-service')
      },

      {
        label: this.isAr() ? 'البيئة': 'Environment',
        command: (event) => this.onStepClick(1, 'environment')
      },
    ];

    this.updateActiveIndex();

    this.navigationSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;
      
      if (!currentUrl.includes('/layout-admin/add/')) {
        this.clearWizardData();
      } else {
        this.updateActiveIndex();
      }
    });
  }

  private clearWizardData() {
    try {
      this.provisionedService.clearSession();
      sessionStorage.removeItem('currentEnvironmentFormData');
      sessionStorage.removeItem('currentCustomerServiceFormData');
      sessionStorage.removeItem('provisionedSessionData');
      sessionStorage.removeItem('editingProvisionedServiceId');
    } catch (error) {
      console.log('Error clearing wizard data:', error);
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  private updateActiveIndex() {
    const currentPath = this.router.url;
    if (currentPath.includes('customer-service')) {
      this.activeIndex = 0;
    } else if (currentPath.includes('environment')) {
      this.activeIndex = 1;
    }
  }

  private async onStepClick(stepIndex: number, routePath: string) {
    const currentPath = this.router.url;
    
    if (routePath === 'environment') {
      const isValid = await this.validateCustomerServiceForm();
      if (!isValid) {
        console.log('Wizard: Customer Service form validation failed - preventing navigation');
        return; 
      }
      console.log('Wizard: Customer Service validation passed - allowing navigation');
    }

    await this.saveCurrentPageData();

    this.activeIndex = stepIndex;
    this.router.navigate([`layout-admin/add/${routePath}`]);
  }

  private async saveCurrentPageData() {
    try {
      const currentPath = this.router.url;
      console.log('Wizard: Current path:', currentPath);
      if (currentPath.includes('environment')) {
        this.provisionedService.triggerSaveEnvironmentData();
      } else if (currentPath.includes('customer-service')) {
        this.provisionedService.triggerSaveCustomerServiceData();
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log('Error saving current page data:', error);
    }
  }

  private async validateCustomerServiceForm(): Promise<boolean> {
    try {
      const isValid = await this.provisionedService.validateCustomerServiceForm();
      return isValid;
    } catch (error) {
      console.log('Error validating customer service form:', error);
      return false;
    }
  }

  isAr(): boolean {
    if (this.layoutService.config.lang == 'ar') {
      return true;
    } else {
      return false;
    }
  }
}
