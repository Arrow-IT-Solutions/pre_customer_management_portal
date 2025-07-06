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
  // {
  //   label: 'Applications',
  //   labelar: 'التطبيقات',
  //   id: 'applications',
  //   icon: ' format_align_justify',
  //   routeLink: "applications"
  // },
  {

    label: 'System Management',
    labelar: 'إدارة النظام',
    id: 'users',
    icon: '',
    items: [
      {
        label: 'Services',
        labelar: 'الخدمات',
        id: 'services',
        routeLink: 'services'
      },
      {
        label: 'Servers',
        labelar: 'المخدمين',
        id: 'servers',
        routeLink: 'servers'
      },
       {
        label: 'DataBases',
        labelar: 'قواعد البيانات',
        id: 'dataBases',
        routeLink: 'DataBases'
      },
       {
        label: 'Customers',
        labelar: 'العملاء',
        id: 'Customers',
        routeLink: 'customers'
      }
    ]
  }



];
