import React from 'react';
import { Logo } from '../common/Logo';
import { Heart, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white/5 p-2 rounded-2xl inline-block">
              <Logo size="md" variant="light" to="/" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              SAKHI is a structured counselling support platform for Anganwadi Workers — equipping frontline health workers with guided decision support for maternal and child care in their communities.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>JPMorgan Code for Good Hackathon Initiative</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#hero" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#challenge" className="hover:text-amber-400 transition-colors">The Malnutrition Challenge</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How SAKHI Works</a></li>
              <li><a href="#for-awws" className="hover:text-amber-400 transition-colors">For Anganwadi Workers</a></li>
              <li><a href="#for-fmch" className="hover:text-amber-400 transition-colors">For FMCH Administrators</a></li>
            </ul>
          </div>

          {/* Col 3: Key Features */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span>•</span> Offline-First Field Sync</li>
              <li className="flex items-center gap-2"><span>•</span> 3-Tier Pregnancy Questionnaire</li>
              <li className="flex items-center gap-2"><span>•</span> Decision Tree Risk Engine</li>
              <li className="flex items-center gap-2"><span>•</span> Instant AI Audio Guidance</li>
              <li className="flex items-center gap-2"><span>•</span> Multi-Language (EN, HI, MR)</li>
            </ul>
          </div>

          {/* Col 4: Contact & FMCH Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">FMCH India</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Foundation for Mother & Child Health, Mumbai & Pan-India Communities</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>contact@fmch-india.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 22 2410 0000 / Toll Free Emergency 108</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} SAKHI · Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Foundation for Mother & Child Health (FMCH India).</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="/login" className="hover:text-white transition-colors">AWW & Admin Portal</a>
            <span>•</span>
            <a href="https://fmch-india.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              fmch-india.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

