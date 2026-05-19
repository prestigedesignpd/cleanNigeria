import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-neutral-50 dark:bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
