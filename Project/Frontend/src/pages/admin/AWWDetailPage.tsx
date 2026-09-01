import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { AWWDetailData } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  User,
  HeartPulse,
  FileCheck2,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AWWDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AWWDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await adminApi.getAWWDetails(id);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading || !data) {
    return <div className="text-center py-12 text-xs text-slate-400">Loading worker profile...</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/awws" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to AWW Directory
      </Link>

      {/* Header Profile Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-teal-950 text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {data.aww.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black">{data.aww.name}</h1>
              <p className="text-xs text-teal-200">
                {data.aww.email} · {data.aww.phone || '9876500112'}
              </p>
            </div>
          </div>

          <Badge variant="success" size="md">
            Active Anganwadi Field Counsellor
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Visits Completed</span>
            <span className="font-bold text-lg text-white">{data.counsellingCount} sessions</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Learning Modules Score</span>
            <span className="font-bold text-lg text-teal-300">95%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Supervisor Rating</span>
            <span className="font-bold text-lg text-amber-300">4.9 / 5.0 ⭐</span>
          </div>
        </div>
      </Card>

      {/* Reports by this AWW */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-900" />
          <span>Counselling History Logged by {data.aww.name} ({data.reports.length})</span>
        </h2>

        {data.reports.length === 0 ? (
          <Card className="text-center py-8 text-xs text-slate-500">
            No reports filed yet for this period.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.reports.map((rep) => {
              const benName = typeof rep.beneficiary === 'object' ? rep.beneficiary?.name : 'Beneficiary';
              return (
                <Card key={rep._id} className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
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
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    {rep.aiGuidance}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

