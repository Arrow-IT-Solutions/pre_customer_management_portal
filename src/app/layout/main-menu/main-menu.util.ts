import { animate, style, transition, trigger } from '@angular/animations';

export interface NavbarData {
  routeLink?: string | '';
  icon?: string;
  label?: string;
  expanded?: boolean;
  id?: string;
  idhash?: string;
  char?: string;
  items?: NavbarData[];
}

export const navbarData: NavbarData[] = [
  {
    label: 'Dashboard',
    id: 'dashboard',
    icon: 'speed',
  },
  {
    label: 'Home',
    id: 'home',
    icon: 'home',
    // items: [
    //   {
    //     routeLink: 'merchants',
    //     icon: 'store',
    //     label: 'Merchants',
    //   },
    //   // {
    //   //   routeLink: 'other',
    //   //   icon: 'store',
    //   //   label: 'Others',
    //   // },
    //   {
    //     routeLink: 'cities',
    //     icon: 'location_on',
    //     label: 'Cities',
    //   },
    //   {
    //     routeLink: 'industries',
    //     icon: 'factory',
    //     label: 'Industries',
    //   },
    //   {
    //     routeLink: 'tiers',
    //     icon: 'social_leaderboard',
    //     label: 'Tiers',
    //   },
    //   {
    //     routeLink: 'points-rules',
    //     icon: 'tune',
    //     label: 'Points Rules',
    //   },
    //   {
    //     routeLink: 'points-rules-owner',
    //     icon: 'tune',
    //     label: 'Points Rules Owner',
    //   },
    //   {
    //     routeLink: 'points-packages',
    //     icon: 'stars',
    //     label: 'Points Packages',
    //   },
    //   {
    //     routeLink: 'branches',
    //     icon: 'store',
    //     label: 'Branches',
    //   },
    //   {
    //     routeLink: 'segments',
    //     icon: 'category',
    //     label: 'Segments',
    //   },
    //   {
    //     routeLink: 'channels',
    //     icon: 'hub',
    //     label: 'Channels',
    //   },
    // ],
  },
  {
    label: 'Reports',
    id: '',
    icon: 'analytics',
    // items: [
    //   {
    //     routeLink: 'campaigns',
    //     icon: 'campaign',
    //     label: 'Campaigns',
    //   },
    //   {
    //     routeLink: 'action-types',
    //     icon: 'directions_walk',
    //     label: 'Action Types',
    //   },
    //   {
    //     routeLink: 'points-management',
    //     icon: 'stars',
    //     label: 'Points Management',
    //   },
    //   {
    //     routeLink: 'points-rules',
    //     icon: 'rule',
    //     label: 'Points Rules',
    //   },
    //   {
    //     routeLink: 'points-rules-owner',
    //     icon: 'rule',
    //     label: 'Points Rules Owner',
    //   },
    //   {
    //     routeLink: 'rewards',
    //     icon: 'redeem',
    //     label: 'Rewards',
    //     items: [
    //       {
    //         routeLink: 'rewards/products-list',
    //         icon: 'redeem',
    //         label: 'Products',
    //       },
    //       {
    //         routeLink: 'rewards/vouchers-list',
    //         icon: 'redeem',
    //         label: 'Vouchers',
    //       },
    //     ],
    //   },
    // ],
  },
  {
    label: 'Employees',
    id: '',
    icon: 'group',
    // items: [
    //   {
    //     routeLink: 'customers',
    //     icon: 'group',
    //     label: 'Customers',
    //   },
    //   {
    //     routeLink: 'redemptions',
    //     icon: 'sync',
    //     label: 'Customers Redemptions',
    //   },
    //   {
    //     routeLink: 'awardings',
    //     icon: 'redeem',
    //     label: 'Customers Awardings',
    //   },
    //   {
    //     routeLink: 'orders-management',
    //     icon: 'shopping_bag',
    //     label: 'Orders Management',
    //   },
    //   {
    //     routeLink: 'purchases-actions',
    //     icon: 'overview',
    //     label: 'Purchases and Actions',
    //   },
    // ],
  },
  {
    label: 'Settings',
    id: '',
    icon: 'settings',
    // items: [
    //   {
    //     routeLink: 'roles',
    //     icon: 'badge',
    //     label: 'Roles',
    //   },
    //   {
    //     routeLink: 'user-management',
    //     icon: 'group',
    //     label: 'Users Management',
    //   },
    //   {
    //     routeLink: 'bank-accounts',
    //     icon: 'account_balance_wallet',
    //     label: 'Bank accounts',
    //   },
    // ],
  },
];
