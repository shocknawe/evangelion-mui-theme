import { useRoute } from './lib/router';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { Dashboard01Page } from './pages/Dashboard01Page';
import { Dashboard02Page } from './pages/Dashboard02Page';

export default function App() {
  const path = useRoute();
  if (path === '/dashboard-01') return <Dashboard01Page />;
  if (path === '/dashboard-02') return <Dashboard02Page />;
  return <DesignSystemPage />;
}
