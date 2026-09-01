import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { User } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, Search, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const AWWMonitoringPage: React.FC = () => {
  const [awws, setAwws] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAWWs = async () => {
      setIsLoading(true);
      try {
        const list = await adminApi.getAllAWWs();
        setAwws(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAWWs();
  }, []);

  const filtered = awws.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.phone && a.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Anganwadi Worker (AWW) Directory & Monitoring
        </h1>
        <p className="text-xs text-slate-500">
          Track field workers, supervise counselling caseloads, and review performance metrics
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by worker name, email, or contact number..."
          className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
        />
      </div>

      {/* AWW List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((aww) => (
          <Card
            key={aww.id || aww._id}
            hoverable
            className="space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {aww.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{aww.name}</h3>
                  <Badge variant="info" size="sm">
                    Active AWW
                  </Badge>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{aww.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{aww.phone || '9876500112'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link to={`/admin/awws/${aww.id || aww._id}`}>
                <Button fullWidth variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Supervision Metrics
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

