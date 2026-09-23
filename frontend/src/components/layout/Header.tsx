import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-gray-700">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-700">
            <User className="h-4 w-4" />
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-red-600 transition-colors ml-2" title="Sign out">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
