import { useNavigate } from "react-router-dom";
import { Home, Inbox, Users, FileText, Settings, Building, BookA, LayoutList } from "lucide-react";

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
    url: "/audit-logs",
    icon: Inbox,
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: Users,
  },
  // {
  //   title: "Configuración",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.url !== "#") navigate(item.url);
                  }}
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <item.icon />
                    <span>{item.title}</span>
                  </div>
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
