import React, { useState, useEffect } from 'react';
import { ruleApi } from '../../lib/api';
import { Rule } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldCheck
} from 'lucide-react';

export const DecisionRulesPage: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [tierFilter, setTierFilter] = useState<number | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Create / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tier: '1',
    questionId: '',
    expectedAnswer: 'YES',
    riskLevel: 'MEDIUM',
    action: ''
  });

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const data = await ruleApi.getAll();
      setRules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const openCreateModal = () => {
    setEditingRule(null);
    setFormData({
      tier: '1',
      questionId: '',
      expectedAnswer: 'YES',
      riskLevel: 'MEDIUM',
      action: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rule: Rule) => {
    setEditingRule(rule);
    setFormData({
      tier: String(rule.tier),
      questionId: rule.questionId,
      expectedAnswer: rule.expectedAnswer,
      riskLevel: rule.riskLevel,
      action: rule.action
    });
    setIsModalOpen(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingRule) {
        await ruleApi.update(editingRule._id, {
          tier: Number(formData.tier) as (1 | 2 | 3),
          questionId: formData.questionId,
          expectedAnswer: formData.expectedAnswer,
          riskLevel: formData.riskLevel as ('LOW' | 'MEDIUM' | 'HIGH'),
          action: formData.action
        });
      } else {
        await ruleApi.create({
          tier: Number(formData.tier) as (1 | 2 | 3),
          questionId: formData.questionId,
          expectedAnswer: formData.expectedAnswer,
          riskLevel: formData.riskLevel as ('LOW' | 'MEDIUM' | 'HIGH'),
          action: formData.action
        });
      }
      setIsModalOpen(false);
      await loadRules();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this decision rule?')) return;
    try {
      await ruleApi.delete(id);
      await loadRules();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRules = tierFilter === 'ALL'
    ? rules
    : rules.filter(r => r.tier === tierFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Decision Rules Engine Management
          </h1>
          <p className="text-xs text-slate-500">
            Configure maternal screening logic, danger triggers, and clinical actions executed in the field
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Add New Clinical Rule
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Trimester:
        </span>
        {(['ALL', 1, 2, 3] as const).map((tVal) => (
          <button
            key={String(tVal)}
            onClick={() => setTierFilter(tVal)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tierFilter === tVal
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tVal === 'ALL' ? 'All Tiers' : `Tier ${tVal} (${tVal === 1 ? '1–3m' : tVal === 2 ? '4–6m' : '7–9m'})`}
          </button>
        ))}
      </div>

      {/* Rules Table / Cards */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const riskColor = rule.riskLevel === 'HIGH' ? 'high' : rule.riskLevel === 'MEDIUM' ? 'medium' : 'low';

          return (
            <Card
              key={rule._id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                    Tier {rule.tier} Trimester
                  </span>
                  <Badge variant={riskColor as any} size="sm">
                    {rule.riskLevel} Risk Trigger
                  </Badge>
                  <span className="text-xs font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                    Question: {rule.questionId} = {rule.expectedAnswer}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-slate-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Action: {rule.action}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => openEditModal(rule)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  title="Edit Rule"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule._id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  title="Delete Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRule ? 'Edit Decision Rule' : 'Create New Decision Rule'}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveRule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Trimester Tier *
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="1">Tier 1 (Months 1–3)</option>
                  <option value="2">Tier 2 (Months 4–6)</option>
                  <option value="3">Tier 3 (Months 7–9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Evaluated Risk Level *
                </label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="LOW">LOW Risk</option>
                  <option value="MEDIUM">MEDIUM Risk</option>
                  <option value="HIGH">HIGH Risk (Urgent PHC Alert)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Question ID Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={formData.questionId}
                  onChange={(e) => setFormData({ ...formData, questionId: e.target.value })}
                  placeholder="e.g. q1_bleeding or q2_swelling"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Trigger Answer Value *
                </label>
                <input
                  type="text"
                  required
                  value={formData.expectedAnswer}
                  onChange={(e) => setFormData({ ...formData, expectedAnswer: e.target.value })}
                  placeholder="e.g. YES or YES_SEVERE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Prescribed Clinical Action / Protocol *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  placeholder="e.g. Immediate referral to PHC for ultrasound examination and high blood pressure screening."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {editingRule ? 'Update Rule' : 'Save Rule'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

