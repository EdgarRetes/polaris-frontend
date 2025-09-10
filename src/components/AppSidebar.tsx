//import { Home, Inbox, Users, FileText, Settings, Building, BookA, LayoutList } from "lucide-react"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

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
    icon: HomeOutlinedIcon,
  },
  {
    title: "Archivos",
    url: "/file-executions",
    icon: DescriptionOutlinedIcon,
  },
  {
    title: "Reglas de Negocio",
    url: "/business-rules",
    icon: MenuBookOutlinedIcon,
  },
  {
    title: "Empresas",
    url: "#",
    icon: BusinessOutlinedIcon,
  },
  {
    title: "Categorías",
    url: "#",
    icon: FormatListBulletedOutlinedIcon,
  },
  {
    title: "Historial",
    url: "#",
    icon: HistoryOutlinedIcon,
  },
  {
    title: "Usuarios",
    url: "#",
    icon: GroupOutlinedIcon,
  },
  {
    title: "Configuración",
    url: "#",
    icon: SettingsOutlinedIcon,
  },
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
