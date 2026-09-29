import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { FleetHealthPanel } from '../components/dashboard/FleetHealthPanel';
import { TeamTodayPanel } from '../components/dashboard/TeamTodayPanel';
import { AttentionList } from '../components/dashboard/AttentionList';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ServiceVolumeChart } from '../components/dashboard/ServiceVolumeChart';

export function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <DashboardHeader />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FleetHealthPanel />
        <TeamTodayPanel />
        <AttentionList />
        <RecentActivity />
        <ServiceVolumeChart />
      </div>
    </div>);

}