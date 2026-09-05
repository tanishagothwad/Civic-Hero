import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { NavigationDrawer } from './components/common/NavigationDrawer';
import { FloatingActionButton } from './components/common/FloatingActionButton';
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

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // If not authenticated, present phone + OTP login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between">
        <LoginModal onOpenLanguage={() => setIsLanguageModalOpen(true)} />
        <footer className="py-4 text-center text-xs text-[#5F6368] bg-white border-t border-[#DADCE0]">
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col font-sans">
      {/* 1. Material App Bar */}
      <RoleSwitcherBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenGamification={() => setIsGamificationModalOpen(true)}
      />

      {/* 2. Material Left Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenGamification={() => setIsGamificationModalOpen(true)}
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
      />

      {/* 3. Main Portal Content */}
      <main className="flex-1 flex flex-col bg-[#F8F9FA]">
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

      {/* 4. Floating Action Button (FAB) for Citizen reporting */}
      {role === 'citizen' && (
        <FloatingActionButton
          onClick={() => setIsReportModalOpen(true)}
          label="Report Issue"
        />
      )}

      {/* Footer Credit */}
      <footer className="py-4 text-center text-xs text-[#5F6368] bg-white border-t border-[#DADCE0] shadow-sm">
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
