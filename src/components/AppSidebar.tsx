import { Monitor, Sprout, Activity, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "COMMAND CENTER", url: "/", icon: Monitor },
  { title: "PLANT NETWORK", url: "/plants", icon: Sprout },
  { title: "OPERATIONS", url: "/operations", icon: Activity },
  { title: "SYSTEMS", url: "/systems", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={open ? "w-72" : "w-16"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          {open && (
            <>
              <h1 className="text-primary font-bold text-lg uppercase tracking-wider">
                PLANT AI
              </h1>
              <p className="text-xs text-sidebar-foreground uppercase">
                v2.1.7 CLASSIFIED
              </p>
            </>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors uppercase tracking-wide text-sm"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary font-bold"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Status Box */}
        {open && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent p-3 rounded border border-sidebar-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-bold text-sidebar-foreground uppercase">
                  SYSTEM ONLINE
                </span>
              </div>
              <div className="text-xs text-sidebar-foreground space-y-1">
                <p>UPTIME: 72:14:33</p>
                <p>PLANTS: 5 ACTIVE</p>
                <p>SENSORS: 3 ONLINE</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
