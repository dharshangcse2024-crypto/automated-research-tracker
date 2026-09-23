import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Search, Bookmark, Settings, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Research', href: '/research', icon: BookOpen },
  { name: 'Research Updates', href: '/updates', icon: Search },
  { name: 'Saved', href: '/saved', icon: Bookmark },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Research<span className="text-blue-600">Tracker</span>
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <NavLink to="/research/new" className="block mb-6">
          <Button className="w-full justify-start gap-2" variant="primary">
            <Plus className="h-4 w-4" />
            New Topic
          </Button>
        </NavLink>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-gray-200 p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )
          }
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
      </div>
    </div>
  );
}
