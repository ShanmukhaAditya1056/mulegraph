import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccountInvestigation from './pages/AccountInvestigation';
import Transactions from './pages/Transactions';
import NetworkGraph from './pages/NetworkGraph';
import Reports from './pages/Reports';
import TemporalTimeline from './pages/TemporalTimeline';
import AIExplanation from './pages/AIExplanation';
import Cases from './pages/Cases';
import EvidenceVerification from './pages/EvidenceVerification';
import Analytics from './pages/Analytics';
import DatasetManagement from './pages/DatasetManagement';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="networks" element={<NetworkGraph />} />
          <Route path="timeline" element={<TemporalTimeline />} />
          <Route path="explanation" element={<AIExplanation />} />
          <Route path="evidence" element={<EvidenceVerification />} />
          <Route path="investigations" element={<AccountInvestigation />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="dataset" element={<DatasetManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
