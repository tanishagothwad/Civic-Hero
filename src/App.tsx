import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { NavigationRail, NavSection } from './components/common/NavigationRail';
import { IssueDetailPanel } from './components/citizen/IssueDetailPanel';
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
import { CivicIssue } from './types';

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

  // App Layout State
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isRailCollapsed, setIsRailCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIssueForPane, setSelectedIssueForPane] = useState<CivicIssue | null>(null);

  // Modals and Overlays
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

  const handleSelectIssue = (issue: CivicIssue) => {
    setSelectedIssueForPane(issue);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col font-sans selection:bg-[#4285F4]/20 selection:text-[#1A73E8]">
      {/* 1. Google Workspace Fixed Top App Bar */}
      <RoleSwitcherBar
        onToggleRail={() => setIsRailCollapsed(!isRailCollapsed)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenGamification={() => setIsGamificationModalOpen(true)}
      />

      {/* 2. Google Workspace App Shell: Left Rail + Main 12-Column Content + Right Reading Pane */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Rail (Gmail / Google Drive pattern) */}
        <NavigationRail
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            if (sec === 'leaderboard') {
              setIsGamificationModalOpen(true);
            }
          }}
          isCollapsed={isRailCollapsed}
          onToggleCollapse={() => setIsRailCollapsed(!isRailCollapsed)}
          onOpenReport={() => setIsReportModalOpen(true)}
          onOpenLanguage={() => setIsLanguageModalOpen(true)}
        />

        {/* Center Main Content Area: Responsive 12-Column Grid */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] justify-between">
          <main className="flex-1 pb-16">
            {role === 'citizen' && (
              <CitizenHome
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenReport={() => setIsReportModalOpen(true)}
                onSelectIssue={handleSelectIssue}
                onOpenGamification={() => setIsGamificationModalOpen(true)}
                selectedIssueId={selectedIssueForPane?.id}
              />
            )}

            {role === 'municipal' && <MunicipalDashboard />}

            {role === 'worker' && <FieldWorkerApp />}
          </main>

          {/* Footer Credit (Preserved) */}
          <footer className="py-4 text-center text-xs text-[#5F6368] bg-white border-t border-[#DADCE0] shrink-0">
            Designed by Tanisha Gothwad
          </footer>
        </div>

        {/* 3. Google-style Slide-In Right Detail Panel (Reading Pane) */}
        {selectedIssueForPane && (
          <div className="fixed inset-y-0 right-0 z-40 lg:static flex h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]">
            {/* Mobile backdrop for reading pane */}
            <div
              className="fixed inset-0 bg-black/40 lg:hidden -z-10"
              onClick={() => setSelectedIssueForPane(null)}
              aria-hidden="true"
            />
            <IssueDetailPanel
              issue={selectedIssueForPane}
              onClose={() => setSelectedIssueForPane(null)}
              onOpenFullModal={() => {
                setSelectedIssueForTracking(selectedIssueForPane);
                setSelectedIssueForPane(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) for mobile/convenience */}
      {role === 'citizen' && (
        <FloatingActionButton
          onClick={() => setIsReportModalOpen(true)}
          label="Report Issue"
        />
      )}

      {/* 4. Modals & Dialogs */}
      {/* 3-Step Report Wizard */}
      <ReportWizard
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitted={(issueId) => {
          const created = issues.find((i) => i.id === issueId);
          if (created) setSelectedIssueForPane(created);
        }}
      />

      {/* Full Screen Issue Tracker Modal (if expanded from reading pane) */}
      {selectedIssueForTracking && (
        <IssueTrackerModal
          issue={selectedIssueForTracking}
          onClose={() => setSelectedIssueForTracking(null)}
        />
      )}

      {/* Gamification & Badges Hub Modal */}
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
          if (item) setSelectedIssueForPane(item);
        }}
      />

      {/* Language Picker Modal */}
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
