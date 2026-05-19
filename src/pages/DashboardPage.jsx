import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Check, AlertCircle, Zap } from 'lucide-react';
import CredentialManager from '../components/CredentialManager';
import InteractiveChecklist from '../components/InteractiveChecklist';
import MermaidDiagrams from '../components/MermaidDiagrams';
import { credentialsAPI, progressAPI } from '../lib/api';

export default function DashboardPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist', 'credentials', 'diagrams'
  const [gtmCredentials, setGtmCredentials] = useState([]);
  const [linkedinCredentials, setLinkedinCredentials] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gtmCreds, liCreds, progressData] = await Promise.all([
        credentialsAPI.getGTM(),
        credentialsAPI.getLinkedIn(),
        progressAPI.getAll(),
      ]);

      setGtmCredentials(gtmCreds);
      setLinkedinCredentials(liCreds);
      setProgress(progressData);

      // Calculate stats
      const totalTasks = progressData.length;
      const completedTasks = progressData.filter(p => p.completed).length;
      setStats({ totalTasks, completedTasks });
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialSaved = async () => {
    await loadData();
  };

  const handleProgressUpdated = async (updatedProgress) => {
    setProgress(updatedProgress);
    const totalTasks = updatedProgress.length;
    const completedTasks = updatedProgress.filter(p => p.completed).length;
    setStats({ totalTasks, completedTasks });
  };

  const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">GTM + LinkedIn Setup</h1>
                <p className="text-xs text-slate-400">
                  Welcome, {user?.firstName || user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-slate-700/20 border border-slate-700/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Overall Progress</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-400">{overallProgress}%</span>
                <span className="text-sm text-slate-500">({stats.completedTasks}/{stats.totalTasks})</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-700/20 border border-slate-700/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">GTM Credentials</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-400">{gtmCredentials.length}</span>
                <span className="text-sm text-slate-500">
                  {gtmCredentials.length > 0 ? '✓ Saved' : 'Not set up'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-700/20 border border-slate-700/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">LinkedIn Credentials</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-cyan-400">{linkedinCredentials.length}</span>
                <span className="text-sm text-slate-500">
                  {linkedinCredentials.length > 0 ? '✓ Saved' : 'Not set up'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-8 border-b border-slate-700/50">
          {[
            { id: 'checklist', label: 'Implementation Checklist', icon: Check },
            { id: 'credentials', label: 'Credentials', icon: AlertCircle },
            { id: 'diagrams', label: 'Diagrams', icon: Zap },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <p className="text-slate-400">Loading your data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'checklist' && (
              <InteractiveChecklist
                progress={progress}
                onProgressUpdated={handleProgressUpdated}
              />
            )}

            {activeTab === 'credentials' && (
              <CredentialManager
                gtmCredentials={gtmCredentials}
                linkedinCredentials={linkedinCredentials}
                onCredentialSaved={handleCredentialSaved}
              />
            )}

            {activeTab === 'diagrams' && (
              <MermaidDiagrams />
            )}
          </>
        )}
      </div>
    </div>
  );
}
