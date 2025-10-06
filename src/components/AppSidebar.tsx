import { Home, Inbox, Users, FileText, Settings, Building, BookA, LayoutList } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Inicio",
    url: "/home",
    icon: Home,
  },
  {
    title: "Archivos",
    url: "/file-executions",
    icon: FileText,
  },
  {
    title: "Reglas de Negocio",
    url: "/business-rules",
    icon: BookA,
  },
  // {
  //   title: "Empresas",
  //   url: "#",
  //   icon: Building,
  // },
  // {
  //   title: "Categorías",
  //   url: "#",
  //   icon: LayoutList,
  // },
  {
    title: "Historial",
    url: "audit-logs",
    icon: Inbox,
  },
  {
    title: "Usuarios",
    url: "#",
    icon: Users,
  },
  // {
  //   title: "Configuración",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="lg">
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
