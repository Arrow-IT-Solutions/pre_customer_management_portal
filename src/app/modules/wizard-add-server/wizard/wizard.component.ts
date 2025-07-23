import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/layout.service';
import { ProvisionedService } from 'src/app/layout/service/provisioned.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {
   items: MenuItem[];
    activeIndex = 0;

     constructor(
     public layoutService: LayoutService,
     private router: Router,
     private route: ActivatedRoute,
     private provisionedService: ProvisionedService) {}
     
      ngOnInit() {
         this.items = [
           {
             label: this.isAr() ? 'المخدم' : 'Server',
             command: (event) => this.onStepClick(0, 'server')
           },
     
           {
             label: this.isAr() ? 'التطبيق': 'Application',
             command: (event) => this.onStepClick(1, 'application')
           },
         ];
     
       
       }
     
       private clearWizardData() {
         try {
           this.provisionedService.clearSession();
           sessionStorage.removeItem('currentServerFormData');
           sessionStorage.removeItem('currentApplicationFormData');
           sessionStorage.removeItem('provisionedSessionData');
           sessionStorage.removeItem('editingProvisionedServiceId');
         } catch (error) {
           console.log('Error clearing wizard data:', error);
         }
       }
     
      
     
       private updateActiveIndex() {
         const currentPath = this.router.url;
         if (currentPath.includes('server-data')) {
           this.activeIndex = 0;
         } else if (currentPath.includes('application')) {
           this.activeIndex = 1;
         }
       }
     
       private async onStepClick(stepIndex: number, routePath: string) {
         const currentPath = this.router.url;
         
         if (routePath === 'application') {
           const isValid = await this.validateServerForm();
           if (!isValid) {
             console.log('Wizard: Server form validation failed - preventing navigation');
             return; 
           }
           console.log('Wizard: Server validation passed - allowing navigation');
         }
     
         await this.saveCurrentPageData();
     
         this.activeIndex = stepIndex;
         this.router.navigate([`layout-admin/add-server/${routePath}`]);
       }
     
       private async saveCurrentPageData() {
         try {
           const currentPath = this.router.url;
           console.log('Wizard: Current path:', currentPath);
           if (currentPath.includes('application')) {
             this.provisionedService.triggerSaveApplicationData();
           } else if (currentPath.includes('server-data')) {
             this.provisionedService.triggerSaveServerData();
           }
     
           await new Promise(resolve => setTimeout(resolve, 100));
         } catch (error) {
           console.log('Error saving current page data:', error);
         }
       }
     
       private async validateServerForm(): Promise<boolean> {
         try {
           const isValid = await this.provisionedService.validateServerForm();
           return isValid;
         } catch (error) {
           console.log('Error validating server form:', error);
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
