import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminFooter } from './AdminFooter';
import { AdminTabType, ClubNotification } from '../../types';

interface AdminLayoutProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  onReturnToSite: () => void;
  notifications: ClubNotification[];
  onMarkNotificationRead: (id: string) => void;
  unreadMessagesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onReturnToSite,
  notifications,
  onMarkNotificationRead,
  unreadMessagesCount,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Dedicated Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onReturnToSite={onReturnToSite}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main Admin Content Column (Offset by 64 (16rem) on large screens) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Dedicated Admin Header */}
        <AdminHeader
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onReturnToSite={onReturnToSite}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          notifications={notifications}
          onMarkNotificationRead={onMarkNotificationRead}
        />

        {/* Dynamic Admin View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Dedicated Admin Footer */}
        <AdminFooter
          onReturnToSite={onReturnToSite}
          onSelectTab={onSelectTab}
        />
      </div>
    </div>
  );
};
