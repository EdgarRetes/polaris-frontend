import { useNavigate } from "react-router-dom";
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
    url: "/",
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
  // {
  //   title: "Empresas",
  //   url: "#",
  //   icon: BusinessOutlinedIcon,
  // },
  // {
  //   title: "Categorías",
  //   url: "#",
  //   icon: FormatListBulletedOutlinedIcon,
  // },
  {
    title: "Historial",
    url: "/audit-logs",
    icon: HistoryOutlinedIcon,
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: GroupOutlinedIcon,
  },
  // {
  //   title: "Configuración",
  //   url: "#",
  //   icon: SettingsOutlinedIcon,
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
