import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { beneficiaryApi, milestoneApi, AWWMilestoneData } from '../../lib/api';
import { Beneficiary } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ApiState } from '../../components/common/ApiState';
import { PortalPageHeader, PortalSection } from '../../components/layout/PortalPageHeader';
import { HeartPulse, Users, Award, ArrowRight, Phone, AlertCircle } from 'lucide-react';

export const AWWDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [milestoneData, setMilestoneData] = useState<AWWMilestoneData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [bens, ms] = await Promise.all([
        beneficiaryApi.getAll(),
        milestoneApi.getByAWW(user.id),
      ]);
      setBeneficiaries(bens);
      setMilestoneData(ms);
      setCompletedCount(ms.counsellingCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const highRiskCount = beneficiaries.filter((b) => b.monthOfPregnancy >= 7).length;

  return (
    <ApiState isLoading={isLoading} error={error} onRetry={fetchData}>
      <div className="space-y-0">
        <PortalPageHeader
          section="AWW Portal / Dashboard"
          title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'Didi'}`}
          description={`AWW Field Unit · ${today}`}
          status={{ label: 'System operational', available: true }}
          actions={
            <Button
              onClick={() => navigate('/aww/counselling/new')}
              variant="primary"
              size="sm"
              leftIcon={<HeartPulse className="w-4 h-4" />}
            >
              {t('startCounselling')}
            </Button>
          }
        />

        <div className="border-x border-b border-slate-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {[
              { label: 'Beneficiaries', value: beneficiaries.length, icon: Users },
              { label: 'Assessments', value: completedCount, icon: HeartPulse },
              { label: 'High-risk (Tier 3)', value: highRiskCount, icon: AlertCircle },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="px-6 py-5 flex items-center gap-4">
                  <Icon className="w-5 h-5 text-blue-900 shrink-0" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{metric.value}</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {metric.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-x border-b border-slate-200">
          <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-slate-200">
            <PortalSection
              title="Priority Follow-ups"
              subtitle="Beneficiaries requiring counselling attention"
              action={
                <Link
                  to="/aww/beneficiaries"
                  className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
              className="border-0"
            >
              {beneficiaries.length === 0 ? (
                <p className="text-sm text-slate-500">No beneficiaries registered yet.</p>
              ) : (
                <div className="overflow-x-auto -mx-5 sm:-mx-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left">
                        <th className="px-5 sm:px-6 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Mother
                        </th>
                        <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Month
                        </th>
                        <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Tier
                        </th>
                        <th className="px-3 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Contact
                        </th>
                        <th className="px-5 sm:px-6 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wide text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {beneficiaries.slice(0, 8).map((ben) => {
                        const tier = ben.monthOfPregnancy <= 3 ? 1 : ben.monthOfPregnancy <= 6 ? 2 : 3;
                        const tierColor = tier === 1 ? 'info' : tier === 2 ? 'warning' : 'high';
                        return (
                          <tr key={ben._id} className="hover:bg-slate-50/80">
                            <td className="px-5 sm:px-6 py-3 font-semibold text-slate-900">{ben.name}</td>
                            <td className="px-3 py-3 text-slate-600">{ben.monthOfPregnancy}</td>
                            <td className="px-3 py-3">
                              <Badge variant={tierColor as 'info' | 'warning' | 'high'} size="sm">
                                Tier {tier}
                              </Badge>
                            </td>
                            <td className="px-3 py-3">
                              <a
                                href={`tel:${ben.phone}`}
                                className="text-blue-900 font-medium flex items-center gap-1 text-xs"
                              >
                                <Phone className="w-3 h-3" />
                                {ben.phone}
                              </a>
                            </td>
                            <td className="px-5 sm:px-6 py-3 text-right">
                              <button
                                onClick={() => navigate(`/aww/counselling/new?beneficiaryId=${ben._id}`)}
                                className="text-xs font-bold text-blue-900 hover:underline"
                              >
                                Start visit
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
          </div>

          <div>
            <PortalSection title="Milestone Progress" className="border-0 h-full">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {milestoneData?.currentMilestone?.name || 'Community Health Champion'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {milestoneData?.currentMilestone?.reward || 'Certificate pending'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>{completedCount} sessions completed</span>
                    <span>{Math.min(100, Math.round((completedCount / 15) * 100))}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2">
                    <div
                      className="bg-teal-700 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (completedCount / 15) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Target for next badge: 15 sessions</p>
                </div>
                <Link
                  to="/aww/milestones"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline"
                >
                  View milestones <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </PortalSection>
          </div>
        </div>
      </div>
    </ApiState>
  );
};
