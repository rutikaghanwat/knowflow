import React, { useState } from 'react';
import {
  User,
  Building,
  Shield,
  Sliders,
  CheckCircle2,
  Save,
  Key,
  Globe,
  Bell,
  Cpu,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { currentUser } from '../data/mockData';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'ai' | 'security'>('profile');
  const [savedNotification, setSavedNotification] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    timezone: currentUser.timezone,
    notificationsEnabled: currentUser.notificationsEnabled,
  });

  const [orgData, setOrgData] = useState({
    name: currentUser.organization,
    slug: 'acme-tech',
    domain: 'knowflow.io',
    ssoEnabled: true,
  });

  const [aiSettings, setAiSettings] = useState({
    sensitivity: 'balanced' as 'strict' | 'balanced' | 'comprehensive',
    requireManagerVerification: true,
    autoExtractGitHubPRs: true,
    defaultBranch: 'main',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'ai', label: 'AI Extraction Engine', icon: Cpu },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Workspace Preferences"
        description="Configure your personal profile, organization parameters, and AI evidence sensitivity thresholds."
      />

      {savedNotification && (
        <div className="p-3.5 rounded-card bg-[#EBF7F0] border border-[#C3E7D3] text-[#26734D] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>Workspace preferences have been updated successfully.</span>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex items-center gap-1.5 border-b border-[#E5EAE6] pb-px overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-control border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-[#183B35] text-[#183B35] bg-white'
                  : 'border-transparent text-[#687570] hover:text-[#202B28] hover:bg-[#F7F8F6]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-card border border-[#E5EAE6] p-6 shadow-subtle">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E5EAE6]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#D0E3D9]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#183B35] font-heading">{currentUser.name}</h4>
                <p className="text-xs text-[#687570]">{currentUser.role} &bull; {currentUser.organization}</p>
                <button
                  type="button"
                  className="mt-2 text-[11px] font-semibold text-[#2F6B5D] hover:underline"
                  onClick={() => alert('Avatar upload modal')}
                >
                  Change profile photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183B35] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183B35] mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F6] border border-[#E5EAE6] rounded-control text-[#687570] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183B35] mb-1">Job Title</label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={e => setProfileData({ ...profileData, role: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183B35] mb-1">Timezone</label>
                <select
                  value={profileData.timezone}
                  onChange={e => setProfileData({ ...profileData, timezone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
                >
                  <option value="UTC+05:30 (IST)">UTC+05:30 (Asia/Kolkata - IST)</option>
                  <option value="UTC+00:00 (GMT)">UTC+00:00 (Europe/London - GMT)</option>
                  <option value="UTC-05:00 (EST)">UTC-05:00 (America/New_York - EST)</option>
                  <option value="UTC-08:00 (PST)">UTC-08:00 (America/Los_Angeles - PST)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EAE6] flex justify-end">
              <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Profile
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Organization */}
        {activeTab === 'organization' && (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">Organization Name</label>
              <input
                type="text"
                value={orgData.name}
                onChange={e => setOrgData({ ...orgData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183B35] mb-1">Workspace Slug</label>
                <input
                  type="text"
                  value={orgData.slug}
                  onChange={e => setOrgData({ ...orgData, slug: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE6] rounded-control font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#183B35] mb-1">Verified Domain</label>
                <input
                  type="text"
                  value={orgData.domain}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-[#F7F8F6] border border-[#E5EAE6] rounded-control text-[#687570]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-control bg-[#F7F8F6] border border-[#E5EAE6] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#183B35] block">SAML 2.0 Single Sign-On</span>
                <span className="text-[11px] text-[#687570]">Enforce corporate Okta or Google Workspace logins</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EBF7F0] text-[#26734D] border border-[#C3E7D3]">
                Enabled
              </span>
            </div>

            <div className="pt-3 border-t border-[#E5EAE6] flex justify-end">
              <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Organization
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: AI Extraction Settings */}
        {activeTab === 'ai' && (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-[#183B35] mb-1">
                Evidence Inference Sensitivity
              </label>
              <p className="text-xs text-[#687570] mb-2">
                Controls the threshold for labeling statements as <strong>Verified Facts</strong> versus <strong>AI Inferences</strong>.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'strict', label: 'Strict (Verbatim)', desc: 'Requires direct commit or text quotes' },
                  { id: 'balanced', label: 'Balanced (Standard)', desc: 'Connects PRs and runbook notes' },
                  { id: 'comprehensive', label: 'Comprehensive', desc: 'Synthesizes wide cross-repo trails' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAiSettings({ ...aiSettings, sensitivity: opt.id as any })}
                    className={`p-3 rounded-control text-left border text-xs transition-colors ${
                      aiSettings.sensitivity === opt.id
                        ? 'border-[#183B35] bg-[#E8F2ED] text-[#183B35] font-semibold'
                        : 'border-[#E5EAE6] bg-white text-[#687570] hover:bg-[#F7F8F6]'
                    }`}
                  >
                    <span className="block font-bold text-[#183B35]">{opt.label}</span>
                    <span className="text-[10px] text-[#687570] mt-0.5 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiSettings.requireManagerVerification}
                  onChange={e =>
                    setAiSettings({ ...aiSettings, requireManagerVerification: e.target.checked })
                  }
                  className="rounded text-[#2F6B5D] focus:ring-[#2F6B5D]"
                />
                <span className="text-xs text-[#202B28] font-medium">
                  Require manager review before publishing finalized handover reports
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiSettings.autoExtractGitHubPRs}
                  onChange={e =>
                    setAiSettings({ ...aiSettings, autoExtractGitHubPRs: e.target.checked })
                  }
                  className="rounded text-[#2F6B5D] focus:ring-[#2F6B5D]"
                />
                <span className="text-xs text-[#202B28] font-medium">
                  Automatically parse merged pull request discussions for architecture decisions
                </span>
              </label>
            </div>

            <div className="pt-3 border-t border-[#E5EAE6] flex justify-end">
              <Button variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save AI Settings
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="space-y-5 max-w-xl">
            <div className="p-4 rounded-control bg-[#F7F8F6] border border-[#E5EAE6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#183B35]">Two-Factor Authentication</span>
                <span className="text-xs font-bold text-[#26734D]">Enforced via SAML</span>
              </div>
              <p className="text-xs text-[#687570]">
                Security posture is managed by your identity provider (Azure AD / Okta).
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#183B35] block">CLI Ingestion API Token</span>
              <p className="text-xs text-[#687570]">
                Used by `knowflow-cli` for CI/CD document indexing during deployment pipelines.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value="knw_live_894f2910ba7c4819d92e817"
                  disabled
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F7F8F6] border border-[#E5EAE6] rounded-control font-mono text-[#687570]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('API token copied to clipboard')}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
