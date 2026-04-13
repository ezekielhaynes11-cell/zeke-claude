import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCog,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/clients',   label: 'Clients',   Icon: Users },
  { to: '/events',    label: 'Events',    Icon: CalendarDays },
  { to: '/staff',     label: 'Staff',     Icon: UserCog },
  { to: '/settings',  label: 'Settings',  Icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-sky-600">CaterCommand</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
