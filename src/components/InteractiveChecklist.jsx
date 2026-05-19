import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { progressAPI } from '../lib/api';

const CHECKLIST_DATA = {
  phase1: {
    title: 'Phase 1: GTM Container Setup',
    color: 'from-blue-500 to-blue-600',
    tasks: [
      { id: 'gtm-account', label: 'Create GTM account & container' },
      { id: 'gtm-copy-id', label: 'Copy container ID (GTM-XXXXXXX)' },
      { id: 'gtm-install-head', label: 'Install GTM snippet in <head>' },
      { id: 'gtm-install-body', label: 'Install GTM snippet in <body>' },
      { id: 'data-layer-init', label: 'Initialize data layer on all pages' },
    ]
  },
  phase2: {
    title: 'Phase 2: Define Conversion Events',
    color: 'from-purple-500 to-purple-600',
    tasks: [
      { id: 'sign-up-event', label: 'Code sign-up event tracking' },
      { id: 'registration-event', label: 'Code event registration tracking' },
      { id: 'form-event', label: 'Code form submission tracking' },
      { id: 'test-events-local', label: 'Test events in browser console' },
    ]
  },
  phase3: {
    title: 'Phase 3: Configure GTM Tags',
    color: 'from-indigo-500 to-indigo-600',
    tasks: [
      { id: 'gtm-variables', label: 'Create GTM variables (event, page, user_id)' },
      { id: 'gtm-triggers', label: 'Create GTM triggers for each event' },
      { id: 'gtm-tags-signup', label: 'Create sign-up conversion tag' },
      { id: 'gtm-tags-registration', label: 'Create event registration tag' },
      { id: 'gtm-tags-form', label: 'Create form submission tag' },
      { id: 'gtm-tags-pageview', label: 'Create LinkedIn Insight Tag (pageview)' },
    ]
  },
  phase4: {
    title: 'Phase 4: LinkedIn Setup',
    color: 'from-cyan-500 to-cyan-600',
    tasks: [
      { id: 'linkedin-insight', label: 'Create LinkedIn Insight Tag' },
      { id: 'linkedin-copy-id', label: 'Copy LinkedIn Partner ID' },
      { id: 'linkedin-conversions', label: 'Create conversion rules' },
      { id: 'linkedin-copy-conv', label: 'Copy Conversion IDs for each rule' },
      { id: 'gtm-add-conv-ids', label: 'Add Conversion IDs to GTM tags' },
    ]
  },
  phase5: {
    title: 'Phase 5: Testing & Validation',
    color: 'from-green-500 to-green-600',
    tasks: [
      { id: 'gtm-preview', label: 'Enable GTM Preview mode' },
      { id: 'devtools-network', label: 'Verify network requests (DevTools)' },
      { id: 'test-signup', label: 'Test sign-up conversion' },
      { id: 'test-registration', label: 'Test event registration conversion' },
      { id: 'test-form', label: 'Test form submission conversion' },
      { id: 'linkedin-verify', label: 'Verify conversions in LinkedIn (2-4hr wait)' },
    ]
  },
  phase6: {
    title: 'Phase 6: Publishing & Launch',
    color: 'from-rose-500 to-rose-600',
    tasks: [
      { id: 'gtm-version', label: 'Create GTM version with description' },
      { id: 'gtm-publish', label: 'Publish GTM container' },
      { id: 'launch-campaign', label: 'Launch LinkedIn ad campaign' },
      { id: 'monitor-daily', label: 'Monitor conversions daily (first week)' },
    ]
  }
};

export default function InteractiveChecklist({ progress, onProgressUpdated }) {
  const [tasks, setTasks] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    // Convert progress array to object for easier lookup
    const progressMap = {};
    progress.forEach(p => {
      if (!progressMap[p.phase_key]) {
        progressMap[p.phase_key] = {};
      }
      progressMap[p.phase_key][p.task_id] = p.completed;
    });
    setTasks(progressMap);
  }, [progress]);

  const toggleTask = async (phaseKey, taskId) => {
    const newValue = !tasks[phaseKey]?.[taskId];
    setSaving(`${phaseKey}-${taskId}`);

    try {
      await progressAPI.updateTask(phaseKey, taskId, newValue, null);
      
      setTasks(prev => ({
        ...prev,
        [phaseKey]: {
          ...(prev[phaseKey] || {}),
          [taskId]: newValue
        }
      }));

      // Update parent
      const updatedProgress = progress.map(p => {
        if (p.phase_key === phaseKey && p.task_id === taskId) {
          return { ...p, completed: newValue };
        }
        return p;
      });
      onProgressUpdated(updatedProgress);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setSaving(null);
    }
  };

  const getPhaseProgress = (phaseKey) => {
    const phase = CHECKLIST_DATA[phaseKey];
    if (!phase) return 0;
    
    const total = phase.tasks.length;
    const completed = phase.tasks.filter(t => tasks[phaseKey]?.[t.id]).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getTotalProgress = () => {
    const allTasks = Object.values(CHECKLIST_DATA).flatMap(p => p.tasks);
    const completed = allTasks.filter(t => {
      for (let phase of Object.keys(CHECKLIST_DATA)) {
        if (CHECKLIST_DATA[phase].tasks.includes(t) && tasks[phase]?.[t.id]) {
          return true;
        }
      }
      return false;
    }).length;
    return allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
  };

  const totalProgress = getTotalProgress();
  const phases = Object.entries(CHECKLIST_DATA);

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100">Overall Implementation Progress</h2>
          <span className="text-3xl font-bold text-cyan-400">{totalProgress}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map(([phaseKey, phase]) => {
          const progress = getPhaseProgress(phaseKey);
          const isComplete = progress === 100;

          return (
            <div key={phaseKey} className="group">
              <div
                className={`border rounded-lg overflow-hidden transition-all ${
                  isComplete
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-slate-700/50 bg-slate-700/20 hover:bg-slate-700/30'
                }`}
              >
                {/* Phase Header */}
                <div
                  className={`px-6 py-4 border-b border-slate-700/30 flex items-center justify-between ${
                    isComplete ? 'bg-green-500/10' : 'bg-gradient-to-r from-slate-700/40 to-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`transition-all ${isComplete ? 'text-green-400' : 'text-slate-400'}`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-100">{phase.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 max-w-xs h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${phase.color} transition-all`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-slate-400">{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="divide-y divide-slate-700/30">
                  {phase.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(phaseKey, task.id)}
                      className={`px-6 py-4 cursor-pointer transition-all ${
                        tasks[phaseKey]?.[task.id]
                          ? 'bg-green-500/5 hover:bg-green-500/10'
                          : 'hover:bg-slate-600/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex-shrink-0 transition-all ${
                            tasks[phaseKey]?.[task.id]
                              ? 'text-green-400'
                              : 'text-slate-500 hover:text-slate-400'
                          }`}
                        >
                          {tasks[phaseKey]?.[task.id] ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>
                        <span
                          className={`flex-1 font-medium transition-all ${
                            tasks[phaseKey]?.[task.id]
                              ? 'text-slate-400 line-through'
                              : 'text-slate-200'
                          }`}
                        >
                          {task.label}
                        </span>
                        {saving === `${phaseKey}-${task.id}` && (
                          <span className="text-xs text-slate-500 animate-pulse">Saving...</span>
                        )}
                        {tasks[phaseKey]?.[task.id] && (
                          <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Footer */}
      {totalProgress === 100 && (
        <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-green-300 mb-2">🎉 Congratulations!</h3>
          <p className="text-slate-300">
            You've completed the GTM + LinkedIn setup. Your conversions should now be tracking!
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Remember to monitor your campaigns in LinkedIn Campaign Manager and watch for conversions (2-4 hour delay expected).
          </p>
        </div>
      )}
    </div>
  );
}
