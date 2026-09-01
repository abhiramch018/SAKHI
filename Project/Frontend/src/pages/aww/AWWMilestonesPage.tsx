import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { milestoneApi } from '../../lib/api';
import { Milestone } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Award, Trophy, Star, Target, CheckCircle2, Sparkles } from 'lucide-react';

export const AWWMilestonesPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    counsellingCount: number;
    currentMilestone?: Milestone;
    allMilestones: Milestone[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      setIsLoading(true);
      try {
        const res = await milestoneApi.getByAWW(user?.id || 'aww_01');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMilestones();
  }, [user]);

  const count = data?.counsellingCount || 12;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Trophy className="w-3.5 h-3.5" />
          <span>Recognition & Target Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Your Monthly Milestones
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
          Every completed maternal counselling session counts toward higher recognition tiers and community care awards.
        </p>
      </div>

      {/* Overview Stat Card */}
      <Card className="p-6 bg-white border-amber-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Completed Counselling Visits
            </span>
            <div className="text-4xl font-black text-slate-900 mt-1">
              {count} <span className="text-sm font-semibold text-slate-500">sessions logged</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-xs text-amber-900">Current Standing:</div>
              <div className="text-sm font-extrabold text-slate-900">
                {data?.currentMilestone?.name || 'Community Health Champion'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Milestone Badges Ladder */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>Milestone Recognition Ladder</span>
        </h2>

        <div className="space-y-3">
          {data?.allMilestones?.map((m, idx) => {
            const isAchieved = count >= m.minCounselling;
            const isCurrent = count >= m.minCounselling && count <= m.maxCounselling;

            return (
              <Card
                key={m._id || idx}
                className={`p-5 transition-all ${
                  isCurrent
                    ? 'border-2 border-amber-500 bg-amber-50/40 ring-4 ring-amber-500/10'
                    : isAchieved
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-slate-50/60 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                        isAchieved
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                        {isCurrent && (
                          <Badge variant="warning" size="sm">
                            Current Tier
                          </Badge>
                        )}
                        {isAchieved && !isCurrent && (
                          <Badge variant="success" size="sm">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Target Range: <strong>{m.minCounselling} – {m.maxCounselling} completed visits</strong>
                      </p>
                      <p className="text-xs font-semibold text-amber-700">
                        Reward: {m.reward}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isAchieved ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> Achieved
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Need {m.minCounselling - count} more visits
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

