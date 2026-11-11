import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth, UserRolePerspective } from '../context/AuthContext';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
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
import { SettingsPage } from '../pages/SettingsPage';

// Employee Pages (Departing & Incoming)
import { MyHandoverPage } from '../pages/employee/MyHandoverPage';
import { UploadSourcesPage } from '../pages/employee/UploadSourcesPage';
import { MyFilesPage } from '../pages/employee/MyFilesPage';
import { ReviewConfirmPage } from '../pages/employee/ReviewConfirmPage';
import { IncomingOverviewPage } from '../pages/employee/IncomingOverviewPage';
import { MyReportPage } from '../pages/employee/MyReportPage';
import { PermittedEvidencePage } from '../pages/employee/PermittedEvidencePage';
import { AcknowledgementPage } from '../pages/employee/AcknowledgementPage';
import { ProjectSummaryPage } from '../pages/employee/ProjectSummaryPage';
import { UnauthorizedPage } from '../pages/app/UnauthorizedPage';

// Role Guard Component
const RoleGuard: React.FC<{
  allowedPerspectives: UserRolePerspective[];
  children: React.ReactNode;
}> = ({ allowedPerspectives, children }) => {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) return <div className="p-10 text-center text-sm text-[#697586]">Loading your workspace…</div>;
  if (!allowedPerspectives.includes(currentUser.perspective)) {
    return <Navigate to="/app/unauthorized" replace />;
  }
  return <>{children}</>;
};

// Smart App Index Redirector based on active role
const AppIndexRedirect: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) return <div className="p-10 text-center text-sm text-[#697586]">Loading your workspace…</div>;
  if (currentUser.perspective === 'departing') {
    return <Navigate to="/app/my-handover" replace />;
  }
  if (currentUser.perspective === 'incoming') {
    return <Navigate to="/app/my-report" replace />;
  }
  if (currentUser.perspective === 'member') return <Navigate to="/app/unauthorized" replace />;
  return <Navigate to="/app/overview" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Authentication & Invitation Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/invite/:token" element={<InviteAcceptPage />} />

      {/* 3. Authenticated Application Shell */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppIndexRedirect />} />

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

        {/* Departing Employee Pages */}
        <Route
          path="my-handover"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <MyHandoverPage />
            </RoleGuard>
          }
        />
        <Route
          path="upload-sources"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <UploadSourcesPage />
            </RoleGuard>
          }
        />
        <Route
          path="my-files"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <MyFilesPage />
            </RoleGuard>
          }
        />
        <Route
          path="review-confirm"
          element={
            <RoleGuard allowedPerspectives={['departing', 'manager']}>
              <ReviewConfirmPage />
            </RoleGuard>
          }
        />

        {/* Incoming Employee Pages */}
        <Route
          path="incoming-overview"
          element={
            <RoleGuard allowedPerspectives={['incoming', 'manager']}>
              <IncomingOverviewPage />
            </RoleGuard>
          }
        />
        <Route
          path="my-report"
          element={
            <RoleGuard allowedPerspectives={['incoming', 'manager']}>
              <MyReportPage />
            </RoleGuard>
          }
        />
        <Route
          path="permitted-evidence"
          element={
            <RoleGuard allowedPerspectives={['incoming', 'manager']}>
              <PermittedEvidencePage />
            </RoleGuard>
          }
        />
        <Route
          path="acknowledgement"
          element={
            <RoleGuard allowedPerspectives={['incoming', 'manager']}>
              <AcknowledgementPage />
            </RoleGuard>
          }
        />

        {/* Shared Read-Only Pages */}
        <Route path="project-summary" element={<ProjectSummaryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* 4. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
