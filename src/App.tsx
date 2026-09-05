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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
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

  const handleToggleRail = () => {
    if (window.innerWidth < 768) {
      setIsMobileNavOpen((prev) => !prev);
    } else {
      setIsRailCollapsed((prev) => !prev);
    }
  };

  const handleSelectIssue = (issue: CivicIssue) => {
    setSelectedIssueForPane(issue);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col font-sans selection:bg-[#4285F4]/20 selection:text-[#1A73E8]">
      {/* 1. Google Workspace Fixed Top App Bar (fixed top-0, height 56px mobile / 64px desktop) */}
      <RoleSwitcherBar
        onToggleRail={handleToggleRail}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenLanguage={() => setIsLanguageModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenGamification={() => setIsGamificationModalOpen(true)}
      />

      {/* 2. Left Navigation Rail (fixed to viewport, height matches viewport below app bar) */}
      <NavigationRail
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setIsMobileNavOpen(false);
          if (sec === 'leaderboard') {
            setIsGamificationModalOpen(true);
          }
        }}
        isCollapsed={isRailCollapsed}
        onToggleCollapse={() => setIsRailCollapsed((prev) => !prev)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onOpenReport={() => {
          setIsMobileNavOpen(false);
          setIsReportModalOpen(true);
        }}
        onOpenLanguage={() => {
          setIsMobileNavOpen(false);
          setIsLanguageModalOpen(true);
        }}
      />

      {/* 3. Main Content Area (Natural window scroll, padding-top accounts for fixed header, padding-left accounts for fixed rail) */}
      <div
        className={`flex-1 flex flex-col justify-between transition-all duration-300 min-h-screen pt-14 sm:pt-16 ${
          isRailCollapsed ? 'md:pl-18' : 'md:pl-64'
        } ${
          selectedIssueForPane ? 'lg:pr-[420px] xl:pr-[460px]' : 'pr-0'
        }`}
      >
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

      {/* 4. Google-style Slide-In Right Detail Panel (Reading Pane) */}
      {selectedIssueForPane && (
        <IssueDetailPanel
          issue={selectedIssueForPane}
          onClose={() => setSelectedIssueForPane(null)}
          onOpenFullModal={() => {
            setSelectedIssueForTracking(selectedIssueForPane);
            setSelectedIssueForPane(null);
          }}
        />
      )}

      {/* 5. Floating Action Button (FAB) for mobile/convenience */}
      {role === 'citizen' && (
        <FloatingActionButton
          onClick={() => setIsReportModalOpen(true)}
          label="Report Issue"
          hasRightPanel={!!selectedIssueForPane}
        />
      )}

      {/* 6. Modals & Dialogs */}
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
