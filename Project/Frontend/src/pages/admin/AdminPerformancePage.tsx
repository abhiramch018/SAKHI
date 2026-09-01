import React, { useState, useEffect } from 'react';
import { adminApi, performanceApi } from '../../lib/api';
import { PerformanceRecord, User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ApiState } from '../../components/common/ApiState';
import { getApiErrorMessage } from '../../lib/api';
import { TrendingUp, Plus, Award, Calendar, User as UserIcon, CheckCircle2 } from 'lucide-react';

export const AdminPerformancePage: React.FC = () => {
  const [performances, setPerformances] = useState<PerformanceRecord[]>([]);
  const [awws, setAwws] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    aww: '',
    period: 'MONTHLY',
    counsellingCount: '25',
    learningScore: '90',
    overallScore: '88'
  });

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dash, awwList] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getAllAWWs(),
      ]);
      setPerformances(dash.performances || []);
      setAwws(awwList);
      if (awwList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          aww: awwList[0].id || awwList[0]._id || '',
        }));
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await performanceApi.create({
        aww: formData.aww,
        period: formData.period,
        counsellingCount: Number(formData.counsellingCount),
        learningScore: Number(formData.learningScore),
        overallScore: Number(formData.overallScore),
        periodStart: new Date(Date.now() - 86400000 * 30).toISOString(),
        periodEnd: new Date().toISOString(),
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ApiState isLoading={isLoading} error={error} onRetry={loadData}>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AWW Performance Analytics & Scoring
          </h1>
          <p className="text-xs text-slate-500">
            Evaluate field visit frequency, learning quiz mastery, and overall supervision ratings
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Add Evaluation Record
        </Button>
      </div>

      {/* Performance Leaderboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performances.map((perf, idx) => {
          const awwName = typeof perf.aww === 'object' ? perf.aww?.name : 'Worker ' + (idx + 1);

          return (
            <Card key={perf._id || idx} className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-800 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{awwName}</h3>
                    <span className="text-xs text-slate-400 font-semibold">{perf.period} Review</span>
                  </div>
                </div>

                <Badge variant="success" size="sm">
                  {perf.overallScore} Pts
                </Badge>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Completed Sessions:</span>
                  <span className="font-bold text-slate-800">{perf.counsellingCount} visits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Learning Score:</span>
                  <span className="font-bold text-teal-700">{perf.learningScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rating:</span>
                  <span className="font-bold text-amber-600">Top Tier</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE EVALUATION MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create AWW Performance Evaluation"
          maxWidth="md"
        >
          <form onSubmit={handleCreatePerformance} className="space-y-4">
            {saveError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
                {saveError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Anganwadi Worker *
              </label>
              <select
                value={formData.aww}
                onChange={(e) => setFormData({ ...formData, aww: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {awws.map((a) => (
                  <option key={a.id || a._id} value={a.id || a._id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Evaluation Period *
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Completed Counselling Sessions *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.counsellingCount}
                onChange={(e) => setFormData({ ...formData, counsellingCount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Learning Modules Score (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.learningScore}
                onChange={(e) => setFormData({ ...formData, learningScore: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Overall Composite Score (0–100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.overallScore}
                onChange={(e) => setFormData({ ...formData, overallScore: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving} className="bg-slate-900">
                Save Evaluation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
    </ApiState>
  );
};

