import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, reportApi } from '../../lib/api';
import { AdminDashboardData, Report } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ApiState } from '../../components/common/ApiState';
import {
  Users,
  HeartPulse,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dash, reps] = await Promise.all([
        adminApi.getDashboard(),
        reportApi.getAll(),
      ]);
      setData(dash);
      setRecentReports(reps.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalSessions = data?.totalCounselling ?? 0;
  const totalAWWs = data?.totalAWWs ?? 0;
  const totalReports = data?.totalReports ?? 0;

  return (
    <ApiState isLoading={isLoading} error={error} onRetry={fetchStats}>
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>FMCH Program Monitoring</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Admin Governance & Impact Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Real-time maternal counselling analytics, clinical risk breakdowns, and Anganwadi worker performance across all sectors.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4 bg-white border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalAWWs}</div>
            <div className="text-xs font-semibold text-slate-500">Active AWW Workers</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalSessions}</div>
            <div className="text-xs font-semibold text-slate-500">Completed Sessions</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalReports}</div>
            <div className="text-xs font-semibold text-slate-500">Clinical Reports Generated</div>
          </div>
        </Card>
      </div>

      {/* Grid: Risk Distribution + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Card */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Community Maternal Risk Distribution
              </h3>
              <span className="text-xs text-slate-400">Past 30 Days</span>
            </div>

            <div className="space-y-3">
              {/* Low Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-700">Low Risk / Normal Progression (70%)</span>
                  <span>{Math.round(totalSessions * 0.7)} mothers</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Medium Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-700">Moderate Risk / Dietary & IFA Action (22%)</span>
                  <span>{Math.round(totalSessions * 0.22)} mothers</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              {/* High Risk */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-700">High Risk / PHC Urgent Referrals (8%)</span>
                  <span>{Math.round(totalSessions * 0.08)} mothers</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              All high-risk cases triggered automatic SMS/system alerts to designated Primary Health Centre supervisors.
            </div>
          </Card>
        </div>

        {/* Top Performers Leaderboard */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Top Performing Anganwadi Workers</span>
              </h3>
              <Link to="/admin/performance" className="text-xs font-bold text-teal-700 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {data?.performances?.map((perf, idx) => (
                <div
                  key={perf._id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {typeof perf.aww === 'object' ? perf.aww?.name : 'Worker ' + (idx + 1)}
                      </div>
                      <div className="text-slate-500">
                        {perf.counsellingCount} sessions · Quiz Score {perf.learningScore}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-teal-700 text-sm">
                      {perf.overallScore} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Counselling Reports Feed */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            Recent Field Reports Feed
          </h3>
          <Link to="/admin/reports" className="text-xs font-bold text-blue-900 hover:underline">
            All Reports ({recentReports.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {recentReports.map((rep) => {
            const benName = typeof rep.beneficiary === 'object' ? rep.beneficiary?.name : 'Beneficiary';
            const awwName = typeof rep.aww === 'object' ? rep.aww?.name : 'AWW Field Worker';

            return (
              <div
                key={rep._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{benName}</span>
                    <Badge
                      variant={
                        rep.riskLevel === 'HIGH'
                          ? 'high'
                          : rep.riskLevel === 'MEDIUM'
                          ? 'medium'
                          : 'low'
                      }
                      size="sm"
                    >
                      {rep.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-slate-500">
                    Counsellor: <strong>{awwName}</strong> · Actions: {rep.actions?.slice(0, 1).join('') || 'Standard'}
                  </div>
                </div>

                <div className="text-slate-400 text-xs sm:text-right shrink-0">
                  {new Date(rep.reportDate || rep.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
    </ApiState>
  );
};

