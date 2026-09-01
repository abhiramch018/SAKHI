import React, { useState, useEffect } from 'react';
import { milestoneApi } from '../../lib/api';
import { Milestone } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Award, Plus, Trophy, Target, Gift, Sparkles } from 'lucide-react';

export const AdminMilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    minCounselling: '0',
    maxCounselling: '10',
    reward: ''
  });

  const loadMilestones = async () => {
    try {
      const data = await milestoneApi.getAll();
      setMilestones(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await milestoneApi.create({
        name: formData.name,
        minCounselling: Number(formData.minCounselling),
        maxCounselling: Number(formData.maxCounselling),
        reward: formData.reward
      });
      setIsModalOpen(false);
      await loadMilestones();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Milestones & Recognition Badges
          </h1>
          <p className="text-xs text-slate-500">
            Define target tiers and reward incentives for Anganwadi Workers
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Create New Milestone
        </Button>
      </div>

      {/* Milestones list */}
      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <Card key={m._id || idx} className="p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                    <Badge variant="warning" size="sm">
                      Level {idx + 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: <strong>{m.minCounselling} – {m.maxCounselling} completed maternal visits</strong>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Reward: <strong>{m.reward}</strong>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Milestone Recognition"
          maxWidth="md"
        >
          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Master Counsellor of the Month"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Min Visits *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.minCounselling}
                  onChange={(e) => setFormData({ ...formData, minCounselling: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Max Visits *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.maxCounselling}
                  onChange={(e) => setFormData({ ...formData, maxCounselling: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Reward / Recognition *
              </label>
              <input
                type="text"
                required
                value={formData.reward}
                onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                placeholder="e.g. Gold Certificate + Health Kit"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving} className="bg-slate-900">
                Save Milestone
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

