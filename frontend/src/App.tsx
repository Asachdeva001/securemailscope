import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Investigations } from './pages/Investigations';
import { InvestigationDetail } from './pages/InvestigationDetail';
import { Upload } from './pages/Upload';
import { Sessions } from './pages/Sessions';
import { SessionDetail } from './pages/SessionDetail';
import { Findings } from './pages/Findings';
import { Certificates } from './pages/Certificates';
import { AiCenter } from './pages/AiCenter';
import { EvidenceCenter } from './pages/EvidenceCenter';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [activeInvestigationName, setActiveInvestigationName] = useState<string | undefined>('Enterprise Audit (Demo)');

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 flex flex-col transition-colors duration-200">
          <Navbar activeInvestigationName={activeInvestigationName} />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/investigations" element={<Investigations />} />
                <Route path="/investigations/:id" element={<InvestigationDetail />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/sessions/:id" element={<SessionDetail />} />
                <Route path="/findings" element={<Findings />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/ai" element={<AiCenter />} />
                <Route path="/evidence" element={<EvidenceCenter />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
