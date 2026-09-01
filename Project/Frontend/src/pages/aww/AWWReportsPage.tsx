import React, { useState, useEffect } from 'react';
import { reportApi } from '../../lib/api';
import { downloadReportPdf } from '../../lib/reportPdf';
import { Report } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PortalPageHeader, PortalSection } from '../../components/layout/PortalPageHeader';
import { FileText, Search, Eye, CheckCircle2, Download, Star } from 'lucide-react';

export const AWWReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
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
    fetchReports();
  }, []);

  const filtered = reports.filter((r) => {
    const bName = typeof r.beneficiary === 'object' ? r.beneficiary?.name : 'Beneficiary';
    return (
      bName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.riskLevel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-0">
      <PortalPageHeader
        section="AWW Portal / Reports"
        title="Counselling Reports"
        description="Review past visit records, risk assessments, clinical actions, and beneficiary feedback."
      />

      <PortalSection className="border-x border-t-0">
        <div className="relative mb-5 -mt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by mother's name or risk level..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
          />
        </div>

      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-400">Loading reports...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 space-y-2 border border-dashed border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-sm text-slate-700">No reports found</p>
          <p className="text-xs text-slate-400">Complete a counselling visit to generate reports.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 sm:px-6 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Mother</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Date</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Risk</th>
                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase">Feedback</th>
                <th className="px-5 sm:px-6 py-2.5 text-[11px] font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((rep) => {
                const benName = typeof rep.beneficiary === 'object' ? rep.beneficiary?.name : 'Beneficiary';
                const riskColor = rep.riskLevel === 'HIGH' ? 'high' : rep.riskLevel === 'MEDIUM' ? 'medium' : 'low';
                return (
                  <tr key={rep._id} className="hover:bg-slate-50/80">
                    <td className="px-5 sm:px-6 py-3 font-semibold text-slate-900">{benName}</td>
                    <td className="px-3 py-3 text-slate-600 text-xs">
                      {new Date(rep.reportDate || rep.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={riskColor as 'high' | 'medium' | 'low'} size="sm">{rep.riskLevel}</Badge>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {rep.beneficiaryFeedback?.rating ? (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {rep.beneficiaryFeedback.rating}/5
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-5 sm:px-6 py-3 text-right space-x-2">
                      <button onClick={() => setSelectedReport(rep)} className="text-xs font-bold text-blue-900 hover:underline inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => downloadReportPdf(rep)} className="text-xs font-bold text-slate-600 hover:underline inline-flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </PortalSection>

      {/* REPORT DETAIL MODAL */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Clinical Counselling Visit Report"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Header info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-400 text-xs block">Beneficiary Mother</span>
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

            {/* Actions */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Prescribed Clinical Actions
              </h4>
              <ul className="space-y-1.5">
                {selectedReport.actions?.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 text-amber-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Guidance Content */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Admin Approved AI Guidance
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                {selectedReport.aiGuidance}
              </div>
            </div>

            {/* Beneficiary Feedback */}
            {selectedReport.beneficiaryFeedback?.rating && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Beneficiary Feedback (AWW Review)
                </h4>
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= (selectedReport.beneficiaryFeedback?.rating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-900 ml-1">
                      {selectedReport.beneficiaryFeedback.rating}/5
                    </span>
                  </div>
                  {selectedReport.beneficiaryFeedback.comment && (
                    <p className="text-xs text-amber-900">{selectedReport.beneficiaryFeedback.comment}</p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                onClick={() => downloadReportPdf(selectedReport)}
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download PDF
              </Button>
              <Button onClick={() => setSelectedReport(null)} variant="primary" size="sm">
                Close Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

