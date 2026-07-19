import { useRoute } from './lib/router';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { Dashboard01Page } from './pages/Dashboard01Page';

export default function App() {
  const path = useRoute();
  if (path === '/dashboard-01') return <Dashboard01Page />;
  return <DesignSystemPage />;
}
