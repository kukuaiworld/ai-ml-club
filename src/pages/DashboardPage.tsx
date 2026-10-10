import { AdminDashboardPage } from './admin/AdminDashboardPage';

interface DashboardPageProps {
  onReturnToSite: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onReturnToSite }) => {
  return <AdminDashboardPage onReturnToSite={onReturnToSite} />;
};
