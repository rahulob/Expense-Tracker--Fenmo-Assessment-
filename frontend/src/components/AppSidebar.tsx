import { Link, useLocation } from "react-router"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "./ui/sidebar"
import { Calendar, CircleDollarSign, Wallet } from "lucide-react"
import clsx from "clsx" // for conditional classNames

export function AppSidebar() {
    const location = useLocation()
    const currentPath = location.pathname

    const isActive = (path: string) => currentPath === path

    return (
        <Sidebar>
            {/* Logo Header */}
            <SidebarHeader>
                <Link to={"/"}>
                    <div className="flex items-center gap-3 p-4 mb-4">
                        <div className="w-8 h-8 bg-linear-to-r from-zinc-500 to-zinc-600 rounded-lg flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-bold text-lg bg-linear-to-r from-zinc-600 to-zinc-700 bg-clip-text text-transparent">
                            Expense Tracker
                        </div>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {/* Dashboard Group */}
                <SidebarGroup>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                        Dashboard
                    </div>
                    <SidebarMenu className="space-y-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className={clsx(
                                    isActive("/") &&
                                    "bg-zinc-200 dark:bg-zinc-700 font-semibold"
                                )}
                            >
                                <Link to="/" className="flex items-center gap-3">
                                    <CircleDollarSign className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className={clsx(
                                    isActive("/view-expenses") &&
                                    "bg-zinc-200 dark:bg-zinc-700 font-semibold"
                                )}
                            >
                                <Link to="/view-expenses" className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>View Expenses</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto">
                <div className="p-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                        © 2026 HRMS Lite
                    </p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
