import { redirect } from 'next/navigation';

// Redirect to the Leads board as the default view for Client Management
export default function ClientManagementPage() {
  redirect('/dashboard/client-management/leads');
}
