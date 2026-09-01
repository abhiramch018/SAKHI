import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { beneficiaryApi, counsellingApi, reportApi } from '../../lib/api';
import { Beneficiary, CounsellingSession, Report } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  Plus,
  Phone,
  Calendar,
  HeartPulse,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const BeneficiariesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedIdFromUrl = searchParams.get('id');

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [historyReports, setHistoryReports] = useState<Report[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // New Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '24',
    phone: '',
    height: '155',
    weight: '50',
    monthOfPregnancy: '2',
    pregnancyNumber: '1',
    pregnancyType: 'NORMAL',
    guardianName: '',
    guardianRelation: 'Husband'
  });

  const loadBeneficiaries = async () => {
    setIsLoading(true);
    try {
      const data = await beneficiaryApi.getAll();
      setBeneficiaries(data);

      if (selectedIdFromUrl) {
        const found = data.find(b => b._id === selectedIdFromUrl);
        if (found) {
          openBeneficiaryDetail(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const openBeneficiaryDetail = async (ben: Beneficiary) => {
    setSelectedBeneficiary(ben);
    setIsLoadingHistory(true);
    try {
      const reports = await reportApi.getByBeneficiary(ben._id);
      setHistoryReports(reports);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleCreateBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newBen = await beneficiaryApi.create({
        name: formData.name,
        age: Number(formData.age),
        phone: formData.phone,
        height: Number(formData.height),
        weight: Number(formData.weight),
        monthOfPregnancy: Number(formData.monthOfPregnancy),
        pregnancyNumber: Number(formData.pregnancyNumber),
        pregnancyType: formData.pregnancyType as 'NORMAL' | 'OPERATION',
        guardianName: formData.guardianName,
        guardianRelation: formData.guardianRelation
      });

      setIsRegisterModalOpen(false);
      await loadBeneficiaries();
      openBeneficiaryDetail(newBen);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery) ||
    b.guardianName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Registered Beneficiaries
          </h1>
          <p className="text-xs text-slate-500">
            Manage mothers in your Anganwadi area and review their counselling trajectory
          </p>
        </div>

        <Button
          onClick={() => setIsRegisterModalOpen(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Register New Mother
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by mother's name, phone, or guardian..."
          className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 shadow-xs"
        />
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ben) => {
          const tier = ben.monthOfPregnancy <= 3 ? 1 : ben.monthOfPregnancy <= 6 ? 2 : 3;
          return (
            <Card
              key={ben._id}
              hoverable
              onClick={() => openBeneficiaryDetail(ben)}
              className="space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{ben.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>Age {ben.age}</span>
                      <span>•</span>
                      <span>Month {ben.monthOfPregnancy}</span>
                    </div>
                  </div>
                  <Badge variant={tier === 1 ? 'info' : tier === 2 ? 'warning' : 'high'} size="sm">
                    Tier {tier}
                  </Badge>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-semibold text-slate-800">{ben.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guardian:</span>
                    <span className="font-semibold text-slate-800">{ben.guardianName} ({ben.guardianRelation})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pregnancy:</span>
                    <span className="font-semibold text-slate-800">#{ben.pregnancyNumber} ({ben.pregnancyType})</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  View Profile & History <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {ben.status}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedBeneficiary && (
        <Modal
          isOpen={!!selectedBeneficiary}
          onClose={() => setSelectedBeneficiary(null)}
          title={`Beneficiary Profile: ${selectedBeneficiary.name}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Quick Profile Summary Card */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold">{selectedBeneficiary.name}</h3>
                  <p className="text-xs text-blue-200">
                    Age {selectedBeneficiary.age} · Pregnancy Month {selectedBeneficiary.monthOfPregnancy} (Trimester {selectedBeneficiary.monthOfPregnancy <= 3 ? '1' : selectedBeneficiary.monthOfPregnancy <= 6 ? '2' : '3'})
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedBeneficiary(null);
                    navigate(`/aww/counselling/new?beneficiaryId=${selectedBeneficiary._id}`);
                  }}
                  variant="warm"
                  size="sm"
                  leftIcon={<HeartPulse className="w-4 h-4" />}
                >
                  Start Counselling Visit
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-800/80 text-xs">
                <div>
                  <span className="text-blue-300 block text-[10px]">Height / Weight</span>
                  <span className="font-bold">{selectedBeneficiary.height}cm / {selectedBeneficiary.weight}kg</span>
                </div>
                <div>
                  <span className="text-blue-300 block text-[10px]">Phone</span>
                  <span className="font-bold">{selectedBeneficiary.phone}</span>
                </div>
                <div>
                  <span className="text-blue-300 block text-[10px]">Guardian</span>
                  <span className="font-bold">{selectedBeneficiary.guardianName}</span>
                </div>
                <div>
                  <span className="text-blue-300 block text-[10px]">Pregnancy Type</span>
                  <span className="font-bold">{selectedBeneficiary.pregnancyType}</span>
                </div>
              </div>
            </div>

            {/* Counselling History Section */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-900" />
                <span>Past Counselling Reports ({historyReports.length})</span>
              </h3>

              {isLoadingHistory ? (
                <div className="text-center py-6 text-xs text-slate-400">Loading visit history...</div>
              ) : historyReports.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
                  <HeartPulse className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600 font-semibold">No prior counselling sessions recorded yet.</p>
                  <p className="text-[11px] text-slate-400">Click below to conduct her first structured counselling visit.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyReports.map((rep) => (
                    <div
                      key={rep._id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-slate-800">
                            {new Date(rep.reportDate || rep.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <Badge
                          variant={rep.riskLevel === 'HIGH' ? 'high' : rep.riskLevel === 'MEDIUM' ? 'medium' : 'low'}
                          size="sm"
                        >
                          {rep.riskLevel} Risk
                        </Badge>
                      </div>

                      <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-100 space-y-1">
                        <div className="font-semibold text-slate-900">Guidance Summary:</div>
                        <div className="text-slate-600 line-clamp-3 whitespace-pre-line">{rep.aiGuidance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* REGISTER NEW BENEFICIARY MODAL */}
      {isRegisterModalOpen && (
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Register New Mother (Beneficiary)"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateBeneficiary} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name of Mother *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sunita Devi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="16"
                  max="50"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Month of Pregnancy (1–9) *
                </label>
                <select
                  value={formData.monthOfPregnancy}
                  onChange={(e) => setFormData({ ...formData, monthOfPregnancy: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="1">Month 1 (Tier 1: 1–3 mo)</option>
                  <option value="2">Month 2 (Tier 1: 1–3 mo)</option>
                  <option value="3">Month 3 (Tier 1: 1–3 mo)</option>
                  <option value="4">Month 4 (Tier 2: 4–6 mo)</option>
                  <option value="5">Month 5 (Tier 2: 4–6 mo)</option>
                  <option value="6">Month 6 (Tier 2: 4–6 mo)</option>
                  <option value="7">Month 7 (Tier 3: 7–9 mo)</option>
                  <option value="8">Month 8 (Tier 3: 7–9 mo)</option>
                  <option value="9">Month 9 (Tier 3: 7–9 mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pregnancy Order *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.pregnancyNumber}
                  onChange={(e) => setFormData({ ...formData, pregnancyNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  min="30"
                  max="150"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  min="100"
                  max="220"
                  required
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Guardian / Husband Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Guardian Relation *
                </label>
                <select
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Husband">Husband</option>
                  <option value="Mother-in-law">Mother-in-law</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                Save Beneficiary
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

