import { animate, style, transition, trigger } from '@angular/animations';

export interface NavbarData {
  routeLink?: string | '';
  icon?: string;
  label?: string;
  labelar?: string;
  expanded?: boolean;
  id?: string;
  idhash?: string;
  char?: string;
  items?: NavbarData[];
}

export const navbarData: NavbarData[] = [
  {
    label: 'Applications',
    labelar: 'التطبيقات',
    id: 'applications',
    icon: ' format_align_justify',
    routeLink: "applications"
  },
  {

    label: 'System Management',
    labelar: 'إدارة النظام',
    id: 'users',
    icon: 'group',
    items: [
      {
        label: 'Employees',
        labelar: 'الموظفين',
        id: 'employees',
        routeLink: 'employees'
      },
      {
        label: 'Settings',
        labelar: 'الإعدادات',
        id: 'Settings',
        icon: 'settings',
        routeLink: 'settings'
      }
    ]
  }



];
