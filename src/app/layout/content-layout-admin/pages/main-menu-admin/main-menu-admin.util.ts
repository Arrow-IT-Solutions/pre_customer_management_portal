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
    icon: 'apps',
    items: [
      {
        label: 'Services',
        labelar: 'الخدمات',
        id: 'services',
        routeLink: 'services'
      },
      
      {
        label: 'Servers',
        labelar: 'الخوادم',
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
        label: 'Ports',
        labelar: 'المنافذ',
        id: 'ports',
        routeLink: 'ports'
      },
      {
        label: 'Credential',
        labelar: 'الاعتمادية',
        id: 'credential',
        routeLink: 'credential'
      },
     
      
       {
        label: 'Customers',
        labelar: 'العملاء',
        id: 'customers',
        routeLink: 'customers'
      },
      
    ]
  },
  {
        label: 'Environments',
        labelar: 'بيئة',
        id: 'environments',
        routeLink: 'environments',
        icon:'language'
  }, 
  {
        label: 'Subscription',
        labelar: 'الاشتراك',
        id: 'subscription',
        routeLink: 'subscription',
        icon:'library_add'
  },
  {
        label: 'Customer Services',
        labelar: 'خدمة العملاء',
        id: 'customer-services',
        routeLink: 'customer-services',
        icon:'group_work'
  },
  
  {
        label: 'Add',
        labelar: 'إضافة',
        id: 'add',
        routeLink: 'add/customer-service',
        icon:'control_point'
  },
   {
        label: 'Add Server',
        labelar: ' إضافة خادم',
        id: 'add',
        routeLink: 'add-server/server-data',
        icon:'control_point'
  }  



];
