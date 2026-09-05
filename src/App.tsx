import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { LanguagePicker } from './components/common/LanguagePicker';
import { ToastNotification } from './components/common/ToastNotification';
import { LoginModal } from './components/auth/LoginModal';
import { CitizenHome } from './components/citizen/CitizenHome';
import { ReportWizard } from './components/citizen/ReportWizard';
import { IssueTrackerModal } from './components/citizen/IssueTrackerModal';
import { GamificationHub } from './components/citizen/GamificationHub';
import { NotificationDrawer } from './components/citizen/NotificationDrawer';
import { MunicipalDashboard } from './components/municipal/MunicipalDashboard';
import { FieldWorkerApp } from './components/worker/FieldWorkerApp';

const MainApp: React.FC = () => {
  const {
    role,
    isAuthenticated,
    isReportModalOpen,
    setIsReportModalOpen,
    selectedIssueForTracking,
    setSelectedIssueForTracking,
    issues,
  } = useApp();

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // If not authenticated, present phone + OTP login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
        <LoginModal onOpenLanguage={() => setIsLanguageModalOpen(true)} />
        <footer className="py-4 text-center text-xs text-slate-500">
          Designed by Tanisha Gothwad
        </footer>
        <LanguagePicker
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />
        <ToastNotification />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col font-sans">
      {/* 1. Sticky Role & Website Navigation Bar */}
      <RoleSwitcherBar
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenGamification={() => setIsGamificationModalOpen(true)}
      />

      {/* 2. Persona Content */}
      <main className="flex-1 flex flex-col bg-slate-100">
        {role === 'citizen' && (
          <CitizenHome
            onOpenReport={() => setIsReportModalOpen(true)}
            onSelectIssue={(issue) => setSelectedIssueForTracking(issue)}
            onOpenGamification={() => setIsGamificationModalOpen(true)}
          />
        )}

        {role === 'municipal' && <MunicipalDashboard />}

        {role === 'worker' && <FieldWorkerApp />}
      </main>

      {/* Footer Credit */}
      <footer className="py-4 text-center text-xs text-slate-500 bg-navy-950 border-t border-navy-900">
        Designed by Tanisha Gothwad
      </footer>

      {/* 3. Modals and Drawers */}
      {/* 3-Step Report Wizard */}
      <ReportWizard
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitted={(issueId) => {
          const created = issues.find((i) => i.id === issueId);
          if (created) setSelectedIssueForTracking(created);
        }}
      />

      {/* Issue Tracker & Stepper Modal */}
      {selectedIssueForTracking && (
        <IssueTrackerModal
          issue={selectedIssueForTracking}
          onClose={() => setSelectedIssueForTracking(null)}
        />
      )}

      {/* Gamification & Badges Hub */}
      <GamificationHub
        isOpen={isGamificationModalOpen}
        onClose={() => setIsGamificationModalOpen(false)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectIssue={(issueId) => {
          const item = issues.find((i) => i.id === issueId);
          if (item) setSelectedIssueForTracking(item);
        }}
      />

      {/* Language Picker */}
      <LanguagePicker
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Real-Time XP Toast Notifications */}
      <ToastNotification />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
