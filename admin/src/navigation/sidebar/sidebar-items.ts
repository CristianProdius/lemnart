import {
  Banknote,
  ChartBar,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  MessageSquare,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        title: "Orders",
        url: "/dashboard/store/:storeId/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    id: 2,
    label: "Apps",
    items: [
      {
        title: "Email",
        url: "/dashboard/email",
        icon: Mail,
      },
      {
        title: "Chat",
        url: "/dashboard/chat",
        icon: MessageSquare,
      },
      {
        title: "Invoice",
        url: "/dashboard/invoice",
        icon: ReceiptText,
      },
    ],
  },
  {
    id: 3,
    label: "Store",
    items: [
      {
        title: "Products",
        url: "/dashboard/store/:storeId/products",
        icon: Package,
      },
      {
        title: "Settings",
        url: "/dashboard/store/:storeId/settings",
        icon: Settings,
      },
    ],
  },
];
