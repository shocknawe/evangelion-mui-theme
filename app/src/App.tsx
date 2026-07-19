import { useRoute } from './lib/router';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { Dashboard01Page } from './pages/Dashboard01Page';
import { Dashboard02Page } from './pages/Dashboard02Page';
import { Dashboard03Page } from './pages/Dashboard03Page';
import { Landing01Page } from './pages/Landing01Page';

export default function App() {
  const path = useRoute();
  if (path === '/dashboard-01') return <Dashboard01Page />;
  if (path === '/dashboard-02') return <Dashboard02Page />;
  if (path === '/dashboard-03') return <Dashboard03Page />;
  if (path === '/landing-01') return <Landing01Page />;
  return <DesignSystemPage />;
}
