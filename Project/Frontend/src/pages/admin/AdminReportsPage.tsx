import React, { useState, useEffect } from 'react';
import { reportApi } from '../../lib/api';
import { Report } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FileCheck2, Search, Filter, Calendar, User, Eye, CheckCircle2 } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const data = await reportApi.getAll();
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = reports.filter((r) => {
    const bName = typeof r.beneficiary === 'object' ? r.beneficiary?.name : '';
    const aName = typeof r.aww === 'object' ? r.aww?.name : '';
    const matchesSearch =
      bName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || r.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          All Maternal Counselling Reports
        </h1>
        <p className="text-xs text-slate-500">
          Central archive of verified field visits, risk assessments, and clinical recommendations
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mother's name or AWW worker name..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                riskFilter === lvl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rep) => {
          const benName = typeof rep.beneficiary === 'object' ? rep.beneficiary?.name : 'Beneficiary';
          const awwName = typeof rep.aww === 'object' ? rep.aww?.name : 'Field Worker';
          const riskColor = rep.riskLevel === 'HIGH' ? 'high' : rep.riskLevel === 'MEDIUM' ? 'medium' : 'low';

          return (
            <Card
              key={rep._id}
              hoverable
              onClick={() => setSelectedReport(rep)}
              className="space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{benName}</h3>
                    <span className="text-xs text-slate-400">AWW: {awwName}</span>
                  </div>
                  <Badge variant={riskColor as any} size="sm">
                    {rep.riskLevel} Risk
                  </Badge>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 block">Actions:</span>
                  <p className="line-clamp-2 text-slate-500">
                    {rep.actions?.join(', ') || 'Standard guidance'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {new Date(rep.reportDate || rep.createdAt || Date.now()).toLocaleDateString('en-IN')}
                </span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View Details
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Clinical Counselling Report Details"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-xs block">Mother:</span>
                <span className="font-extrabold text-base text-slate-900">
                  {typeof selectedReport.beneficiary === 'object'
                    ? selectedReport.beneficiary?.name
                    : 'Beneficiary'}
                </span>
              </div>
              <Badge
                variant={
                  selectedReport.riskLevel === 'HIGH'
                    ? 'high'
                    : selectedReport.riskLevel === 'MEDIUM'
                    ? 'medium'
                    : 'low'
                }
                size="md"
              >
                {selectedReport.riskLevel} Risk
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase">Actions:</h4>
              <ul className="space-y-1.5">
                {selectedReport.actions?.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 text-amber-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase">Guidance Script:</h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                {selectedReport.aiGuidance}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedReport(null)} variant="primary" size="sm">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

