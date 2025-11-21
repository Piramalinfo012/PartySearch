import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import PendingOrder from './pages/admin/PendingOrder';
import PendingStage from './pages/admin/PendingStage';
import Sidebar from './layouts/Sidebar';

function App() {
  return (
    <Routes>
      {/* Main Layout with Sidebar */}
      <Route path="/" element={<Sidebar />}>
        <Route index element={<Navigate to="/party-search" replace />} />
        <Route path="party-search" element={<Dashboard />} />
        <Route path="pending-order" element={<PendingOrder />} />
        <Route path="pending-stage" element={<PendingStage />} />
      </Route>
      
      {/* Redirect any unknown routes to party-search */}
      <Route path="*" element={<Navigate to="/party-search" replace />} />
    </Routes>
  );
}

export default App;