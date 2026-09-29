import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboardIcon,
  Building2Icon,
  BriefcaseIcon,
  FileTextIcon,
  ShoppingCartIcon,
  HardHatIcon,
  PrinterIcon,
  PackageIcon,
  TriangleAlertIcon,
  GaugeIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  MessageSquareIcon } from
'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  description: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
{
  title: 'Overview',
  items: [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboardIcon, description: 'Fleet health, team availability and open issues at a glance.' }]

},
{
  title: 'Sales',
  items: [
  { key: 'customers', label: 'Customers', path: '/customers', icon: Building2Icon, description: 'Customer accounts, sites and their machines.' },
  { key: 'salesman', label: 'Salesman', path: '/salesman', icon: BriefcaseIcon, description: 'Manage your sales team, their customer assignments and targets.' },
  { key: 'estimates', label: 'Estimates', path: '/estimates', icon: FileTextIcon, comingSoon: true, description: 'Prepare and send repair and supply estimates for customer approval.' },
  { key: 'new-sales', label: 'New Sales', path: '/new-sales', icon: ShoppingCartIcon, comingSoon: true, description: 'Record new machine sales and hand them over for installation.' }]

},
{
  title: 'Service',
  items: [
  { key: 'tech-officers', label: 'Tech Officers', path: '/tech-officers', icon: HardHatIcon, description: 'Field technicians, their skills and job history.' },
  { key: 'machines', label: 'Machines', path: '/machines', icon: PrinterIcon, description: 'Every installed machine across all customer sites, with contract and service status.' },
  { key: 'parts', label: 'Parts', path: '/parts', icon: PackageIcon, comingSoon: true, description: 'Spare parts inventory, stock levels and parts issued to jobs.' },
  { key: 'breakdowns', label: 'Breakdowns', path: '/breakdowns', icon: TriangleAlertIcon, comingSoon: true, description: 'Log breakdown calls and dispatch the nearest available tech officer.' },
  { key: 'meter-reading', label: 'Meter Reading', path: '/meter-reading', icon: GaugeIcon, comingSoon: true, description: 'Capture monthly meter readings for per-copy and rental billing.' },
  { key: 'service-visits', label: 'Service Visits', path: '/service-visits', icon: CalendarCheckIcon, comingSoon: true, description: 'Schedule preventive maintenance and track visit completion.' }]

},
{
  title: 'Insights',
  items: [
  { key: 'reports', label: 'Reports', path: '/reports', icon: ClipboardListIcon, comingSoon: true, description: 'Operational and sales reports you can filter and export.' },
  { key: 'customer-feedbacks', label: 'Customer Feedbacks', path: '/customer-feedbacks', icon: MessageSquareIcon, comingSoon: true, description: 'Ratings and comments collected after every completed job.' }]

}];
