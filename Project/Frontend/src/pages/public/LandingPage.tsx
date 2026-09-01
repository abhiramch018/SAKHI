import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { SakhiLogoMark } from '../../components/common/SakhiLogoMark';
import {
  Heart,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Users,
  Activity,
  ChevronRight,
  Volume2,
  WifiOff,
  Stethoscope
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    { number: '01', title: 'Select Beneficiary', desc: 'Pick or register the pregnant woman with minimalPoshan-aligned data.' },
    { number: '02', title: 'Answer 5–7 Questions', desc: 'Tier-specific screening based on pregnancy trimester (1–3mo, 4–6mo, 7–9mo).' },
    { number: '03', title: 'Instant AI Evaluation', desc: 'Rules engine evaluates clinical risks & generates instant evidence-based guidance.' },
    { number: '04', title: 'Counsel with Audio', desc: 'Explain remedies with confidence; use voice audio in Hindi, Marathi, or English.' },
    { number: '05', title: 'Mark Attendance', desc: 'Lock the visit record; counts automatically toward your monthly performance milestones.' },
    { number: '06', title: 'Track & Sync', desc: 'Works completely offline; syncs automatically once back in network range.' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-teal-900 text-white pt-16 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-teal-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>An Initiative by Foundation for Mother & Child Health (FMCH)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              Helping every Anganwadi Worker <span className="text-amber-400 underline decoration-amber-400/40">counsel with confidence</span>.
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed">
              SAKHI provides frontline health workers with structured, instant, admin-approved AI guidance during maternal visits — eradicating child malnutrition right from pregnancy, even in zero-connectivity areas.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/login">
                <Button size="lg" variant="warm" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Launch SAKHI App
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                  Join as Anganwadi Worker
                </Button>
              </Link>
            </div>

            {/* Quick anchor sub-nav */}
            <div className="pt-6 border-t border-blue-800/60 flex flex-wrap gap-4 text-xs font-medium text-blue-200">
              <a href="#challenge" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> The Challenge
              </a>
              <a href="#how-it-works" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> 6-Step Workflow
              </a>
              <a href="#for-awws" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> Field Features
              </a>
              <a href="#impact" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-teal-400" /> Community Impact
              </a>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <SakhiLogoMark size={40} />
                  <div>
                    <h2 className="font-bold text-sm text-slate-900">SAKHI Field Visit Simulation</h2>
                    <span className="text-[11px] text-teal-700 font-semibold">Tier 2 · Month 5 Counselling</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live
                </span>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-slate-500 font-medium">Beneficiary:</div>
                  <div className="font-bold text-slate-900 text-sm">Pooja Sharma (Age 26)</div>
                  <div className="text-slate-600">Weight: 54kg | Height: 158cm | IFA Taken: Yes</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1 text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Evaluated Risk: Moderate Swelling Detected</span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 leading-tight">
                    Prescribe blood pressure check at PHC and advise legs elevation with reduced dietary salt.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-blue-900">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="font-semibold text-[11px]">Instant Audio Guidance Ready</span>
                  </div>
                  <span className="text-[10px] bg-blue-200 font-bold px-2 py-0.5 rounded text-blue-950">
                    Hindi / Marathi
                  </span>
                </div>
              </div>

              <Link to="/login" className="block pt-2">
                <Button fullWidth variant="primary" size="sm">
                  Try Interactive Session →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CHALLENGE SECTION */}
      <section id="challenge" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
              The Malnutrition Reality
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              65%
            </div>
            <p className="text-sm font-semibold text-slate-600">
              of maternal home visits lack structured, timely clinical decision support.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Frontline Anganwadi Workers (AWWs) are the lifeline of rural & urban slum communities in India. Yet, they manage heavy caseloads with paper manuals, unstandardized checklists, and patchy cellular connectivity.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-sm text-slate-900">Low Connectivity</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                SAKHI stores questionnaires locally and queues sessions so AWWs can counsel without internet interruptions.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-sm text-slate-900">Early Danger Detection</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant decision-tree triggers identify preeclampsia, anemia, and pregnancy distress before they become critical.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-sm text-slate-900">Vernacular Audio</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear voice playback in regional languages helps workers explain nuanced dietary habits to mother and family.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-sm text-slate-900">Admin Approved AI</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every recommendation strictly aligns with FMCH validated protocols, avoiding unverified AI hallucinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DO / HOW SAKHI HELPS (TWO COLUMN SPLIT) */}
      <section id="for-awws" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
            Tailored User Roles
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            One Unified Platform, Two Powerful Experiences
          </h2>
          <p className="text-sm text-slate-600">
            Whether in the field with a mother or at the FMCH office monitoring community health metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: For AWWs */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-md">
                Frontline Field App
              </div>
              <h2 className="text-2xl font-bold text-white">For Anganwadi Workers (AWWs)</h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Designed specifically for low-end Android smartphones. Large tap targets, rapid single-scroll questionnaire, offline caching, and instant audio guidance.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-blue-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>5–7 rapid questions tailored to pregnancy month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Offline session queue with automatic background sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Bite-sized video learning & milestone badges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Built-in voice assistant for quick counselling doubts</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link to="/login">
                <Button variant="warm" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Access AWW Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: For FMCH Admins */}
          <div id="for-fmch" className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-teal-400 text-slate-950 px-3 py-1 rounded-md">
                FMCH Governance & Rules
              </div>
              <h2 className="text-2xl font-bold text-white">For FMCH Program Supervisors</h2>
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                Configure decision-tree algorithms without code, monitor field counselling activity in real-time, and track high-risk maternal alerts across all sectors.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-teal-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Visual Decision Rule Builder (Tier, Answer → Risk & Action)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Live AWW performance leaderboards & attendance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Aggregate community risk distribution analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Create video modules and mini-quizzes for worker training</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link to="/login">
                <Button variant="outline" fullWidth className="bg-white/10 border-teal-400/40 text-teal-200 hover:bg-white/20">
                  Access Admin Console
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IMPACT / STATS STRIP */}
      <section id="impact" className="bg-blue-900 text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-amber-400">10,000+</div>
            <div className="text-xs sm:text-sm text-blue-200 font-medium">Beneficiaries Supported</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-teal-300">500+</div>
            <div className="text-xs sm:text-sm text-blue-200 font-medium">AWWs Onboarded</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-amber-400">45,000+</div>
            <div className="text-xs sm:text-sm text-blue-200 font-medium">Counselling Sessions</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-teal-300">100%</div>
            <div className="text-xs sm:text-sm text-blue-200 font-medium">FMCH Approved Guidelines</div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (6-STEP VISUAL FLOW) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            Step-by-Step Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            How SAKHI Guides Every Visit
          </h2>
          <p className="text-sm text-slate-600">
            A frictionless 5-minute process engineered for maximum field compliance and clinical clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="text-2xl font-black text-blue-900/20 group-hover:text-blue-900/40 transition-colors">
                {step.number}
              </div>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIAL / FIELD STORY */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/80 rounded-3xl p-8 sm:p-10 border border-amber-200/80 shadow-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 mx-auto flex items-center justify-center font-bold text-lg">
            “
          </div>
          <blockquote className="text-base sm:text-lg font-medium text-slate-800 italic leading-relaxed">
            "Previously, remembering the specific guidance points for 2nd trimester blood pressure vs 3rd trimester birth planning was difficult during field visits. With SAKHI, I answer 5 simple questions on my phone, and it immediately tells me if the mother has high risk and needs a hospital referral. Even when I am in areas with no network, the app works flawlessly."
          </blockquote>
          <div>
            <div className="font-bold text-sm text-slate-900">Shailaja Kadam</div>
            <div className="text-xs text-slate-500">Anganwadi Worker · Dharavi Sector 4, Mumbai</div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-800 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready to empower your frontline maternal counselling?
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Join hundreds of Anganwadi Workers providing high-impact, structured nutrition counselling to mothers and newborns across India.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/login">
              <Button size="lg" variant="warm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Login to Your Account
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="bg-white text-blue-950 hover:bg-slate-100 border-none font-bold">
                Register New Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

