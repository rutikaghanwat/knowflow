import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { EmployeeLayout } from '../components/layout/EmployeeLayout';
import { useAuth, UserRolePerspective } from '../context/AuthContext';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { InviteAcceptPage } from '../pages/auth/InviteAcceptPage';

// Manager Workspace Pages
import { OverviewPage } from '../pages/OverviewPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/app/ProjectDetailPage';
import { TeamMembersPage } from '../pages/TeamMembersPage';
import { KnowledgeSourcesPage } from '../pages/KnowledgeSourcesPage';
import { KnowledgeAnalysisPage } from '../pages/app/KnowledgeAnalysisPage';
import { ProjectStatePage } from '../pages/app/ProjectStatePage';
import { EvidencePage } from '../pages/app/EvidencePage';
import { HandoversPage } from '../pages/HandoversPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ApprovalsPage } from '../pages/ApprovalsPage';
import { SharingAcknowledgementsPage } from '../pages/app/SharingAcknowledgementsPage';
import { AuditHistoryPage } from '../pages/app/AuditHistoryPage';
import { SettingsPage } from '../pages/SettingsPage';
import { UnauthorizedPage } from '../pages/app/UnauthorizedPage';

// Employee Portal Pages
import { EmployeeOverviewPage } from '../pages/employee/EmployeeOverviewPage';
import { EmployeeProjectsPage } from '../pages/employee/EmployeeProjectsPage';
import { UploadSourcesPage } from '../pages/employee/UploadSourcesPage';
import { MyFilesPage } from '../pages/employee/MyFilesPage';
import { ReviewConfirmPage } from '../pages/employee/ReviewConfirmPage';
import { MyReportPage } from '../pages/employee/MyReportPage';
import { AcknowledgementPage } from '../pages/employee/AcknowledgementPage';
import { EmployeeKnowledgeBasePage } from '../pages/employee/EmployeeKnowledgeBasePage';
import { EmployeeReportsPage } from '../pages/employee/EmployeeReportsPage';
import { EmployeeNotificationsPage } from '../pages/employee/EmployeeNotificationsPage';
import { EmployeeProfilePage } from '../pages/employee/EmployeeProfilePage';
import { PermittedEvidencePage } from '../pages/employee/PermittedEvidencePage';
import { ProjectSummaryPage } from '../pages/employee/ProjectSummaryPage';

// Role Guard Component
const RoleGuard: React.FC<{
  allowedPerspectives: UserRolePerspective[];
  children: React.ReactNode;
}> = ({ allowedPerspectives, children }) => {
  const { currentUser } = useAuth();
  if (!allowedPerspectives.includes(currentUser.perspective)) {
    return <Navigate to="/app/unauthorized" replace />;
  }
  return <>{children}</>;
};

// Manager App Index Redirector
const ManagerIndexRedirect: React.FC = () => {
  const { currentUser } = useAuth();
  if (currentUser.perspective !== 'manager') {
    return <Navigate to="/employee/overview" replace />;
  }
  return <Navigate to="/app/overview" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Authentication & Invitation Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/accept-invite/:token" element={<InviteAcceptPage />} />
      <Route path="/invite/:token" element={<InviteAcceptPage />} />

      {/* 3. Manager Authenticated Application Shell (/app/*) */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<ManagerIndexRedirect />} />

        {/* Manager-Protected Pages */}
        <Route
          path="overview"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <OverviewPage />
            </RoleGuard>
          }
        />
        <Route
          path="projects"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <ProjectsPage />
            </RoleGuard>
          }
        />
        <Route
          path="projects/:id"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <ProjectDetailPage />
            </RoleGuard>
          }
        />
        <Route
          path="team"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <TeamMembersPage />
            </RoleGuard>
          }
        />
        <Route
          path="sources"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <KnowledgeSourcesPage />
            </RoleGuard>
          }
        />
        <Route
          path="analysis"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <KnowledgeAnalysisPage />
            </RoleGuard>
          }
        />
        <Route
          path="project-state"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <ProjectStatePage />
            </RoleGuard>
          }
        />
        <Route
          path="evidence"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <EvidencePage />
            </RoleGuard>
          }
        />
        <Route
          path="handovers"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <HandoversPage />
            </RoleGuard>
          }
        />
        <Route
          path="reports"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <ReportsPage />
            </RoleGuard>
          }
        />
        <Route
          path="reports/:id"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <ReportsPage />
            </RoleGuard>
          }
        />
        <Route
          path="approvals"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <ApprovalsPage />
            </RoleGuard>
          }
        />
        <Route
          path="sharing-acknowledgements"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <SharingAcknowledgementsPage />
            </RoleGuard>
          }
        />
        <Route
          path="audit"
          element={
            <RoleGuard allowedPerspectives={['manager']}>
              <AuditHistoryPage />
            </RoleGuard>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Backward-compatible redirects for legacy employee paths inside /app */}
        <Route path="my-handover" element={<Navigate to="/employee/overview" replace />} />
        <Route path="upload-sources" element={<Navigate to="/employee/handover/upload" replace />} />
        <Route path="my-files" element={<Navigate to="/employee/handover/files" replace />} />
        <Route path="review-confirm" element={<Navigate to="/employee/handover/review" replace />} />
        <Route path="incoming-overview" element={<Navigate to="/employee/overview" replace />} />
        <Route path="my-report" element={<Navigate to="/employee/report" replace />} />
        <Route path="permitted-evidence" element={<Navigate to="/employee/knowledge-base" replace />} />
        <Route path="acknowledgement" element={<Navigate to="/employee/report/acknowledge" replace />} />
        <Route path="project-summary" element={<ProjectSummaryPage />} />
      </Route>

      {/* 4. Employee Authenticated Portal Shell (/employee/*) */}
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route index element={<Navigate to="/employee/overview" replace />} />
        <Route path="overview" element={<EmployeeOverviewPage />} />
        <Route path="projects" element={<EmployeeProjectsPage />} />

        {/* Departing Employee Routes */}
        <Route
          path="handover/upload"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <UploadSourcesPage />
            </RoleGuard>
          }
        />
        <Route
          path="handover/files"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <MyFilesPage />
            </RoleGuard>
          }
        />
        <Route
          path="handover/review"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <ReviewConfirmPage />
            </RoleGuard>
          }
        />

        {/* Incoming Employee Routes */}
        <Route
          path="report"
          element={
            <RoleGuard allowedPerspectives={['incoming', 'manager']}>
              <MyReportPage />
            </RoleGuard>
          }
        />
        <Route
          path="report/acknowledge"
          element={
            <RoleGuard allowedPerspectives={['incoming', 'manager']}>
              <AcknowledgementPage />
            </RoleGuard>
          }
        />

        {/* Shared Employee Resources */}
        <Route path="knowledge-base" element={<EmployeeKnowledgeBasePage />} />
        <Route path="reports" element={<EmployeeReportsPage />} />
        <Route path="notifications" element={<EmployeeNotificationsPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
      </Route>

      {/* 5. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
