import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { DeviceFrame } from './components/common/DeviceFrame';
import { Header } from './components/common/Header';
import { LanguagePicker } from './components/common/LanguagePicker';
import { ToastNotification } from './components/common/ToastNotification';
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
    isReportModalOpen,
    setIsReportModalOpen,
    selectedIssueForTracking,
    setSelectedIssueForTracking,
    issues,
  } = useApp();

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col font-sans">
      {/* 1. Sticky Role & Persona Switcher */}
      <RoleSwitcherBar onOpenLanguage={() => setIsLanguageModalOpen(true)} />

      {/* 2. Persona Content */}
      <main className="flex-1 flex flex-col">
        {role === 'citizen' && (
          <DeviceFrame>
            <Header
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenGamification={() => setIsGamificationModalOpen(true)}
              onOpenLanguage={() => setIsLanguageModalOpen(true)}
            />
            <CitizenHome
              onOpenReport={() => setIsReportModalOpen(true)}
              onSelectIssue={(issue) => setSelectedIssueForTracking(issue)}
              onOpenGamification={() => setIsGamificationModalOpen(true)}
            />
          </DeviceFrame>
        )}

        {role === 'municipal' && <MunicipalDashboard />}

        {role === 'worker' && (
          <DeviceFrame>
            <Header
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenGamification={() => setIsGamificationModalOpen(true)}
              onOpenLanguage={() => setIsLanguageModalOpen(true)}
            />
            <FieldWorkerApp />
          </DeviceFrame>
        )}
      </main>

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
