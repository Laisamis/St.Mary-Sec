import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Users, 
  BookOpen, 
  Building2, 
  Calendar, 
  Bell, 
  FileCode2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Announcement } from '../types';

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
  announcements: Announcement[];
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onNavigate,
  announcements
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-xl border border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/st_marys_campus_hero_1794399483830.jpg" 
            alt="St. Mary's Secondary School Main Campus" 
            className="w-full h-full object-cover object-center opacity-30 brightness-90 filter"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl px-8 sm:px-12 py-16 sm:py-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wider uppercase border border-blue-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Welcome to St. Mary's Secondary School</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-heading">
            Excellence in Knowledge, <br />
            <span className="text-blue-400">Integrity in Character.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Founded in 1984, St. Mary's provides an empowering secondary education that inspires students to achieve academic distinction, moral maturity, and servant leadership.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Student Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-sm border border-slate-700 backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <span>Student / Admin Login</span>
            </button>

            <button
              onClick={() => onNavigate('academics')}
              className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition-colors flex items-center gap-1.5"
            >
              <span>Explore Curriculum</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Fact Banner */}
        <div className="relative z-10 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono-numbers">1,240</div>
            <div className="text-xs text-slate-400 mt-0.5">Enrolled Students</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono-numbers">98.4%</div>
            <div className="text-xs text-slate-400 mt-0.5">University Qualification</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-numbers">48</div>
            <div className="text-xs text-slate-400 mt-0.5">Teaching Faculty</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono-numbers">18</div>
            <div className="text-xs text-slate-400 mt-0.5">Clubs & Sports Teams</div>
          </div>
        </div>
      </section>

      {/* Main Grid: Principal Welcome & Quick Action Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Principal's Note */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Office of the Principal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              A Warm Welcome to St. Mary's Secondary School
            </h2>

            <div className="text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed">
              <p>
                At St. Mary's, we believe every learner possesses unique capabilities waiting to be awakened. Our holistic secondary school program balances rigorous STEM and humanities instruction with active physical sports, creative arts, and moral discipline.
              </p>
              <p>
                This school portal allows prospective students to register seamlessly online, enables existing students to monitor their term grades, class timetables, and fee statements, and equips administrators with reliable record management.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">Dr. Elizabeth Kiprono, Ph.D.</div>
                <div className="text-xs text-slate-500">Chief Principal & Secretary to Board of Management</div>
              </div>
              <span className="text-xs text-slate-400 italic">Est. 1984 · MOE Reg. #39420</span>
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-2xl p-7 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold font-heading">Portal Access Hub</h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Log in to access academic transcripts, fee records, student identity profiles, and administrative registries.
              </p>
            </div>

            <div className="space-y-3 pt-6">
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>Login as Student or Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>New Student Registration</span>
              </button>

              <button
                onClick={() => onNavigate('php-docs')}
                className="w-full py-2 px-3 text-blue-200 hover:text-white text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>View PHP & MS Access Backend Files</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Pillars: Science Lab & Library */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Life & Learning</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            World-Class Secondary Education Facilities
          </h2>
          <p className="text-slate-600 text-sm">
            Providing an environment where young men and women cultivate scholarly depth, critical curiosity, and community service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Science Lab */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            <div className="h-56 sm:h-64 overflow-hidden relative">
              <img 
                src="/src/assets/images/st_marys_science_lab_1794399484954.jpg" 
                alt="Students in modern chemistry and biology laboratory" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                Natural Sciences Wing
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Modern Scientific Discovery Labs</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Dedicated Chemistry, Physics, and Biology laboratories equipped for both junior exploratory experiments and senior national examination practical assessments.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 3 Physics Labs</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 2 Chemistry Labs</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Digital Sensors</span>
              </div>
            </div>
          </div>

          {/* Card 2: Library */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            <div className="h-56 sm:h-64 overflow-hidden relative">
              <img 
                src="/src/assets/images/st_marys_library_students_1794399483786.jpg" 
                alt="Secondary school students studying together in school library" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                Memorial Learning Library
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Resource Library & Collaborative Study</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Over 14,000 volumes across literature, world history, geography, mathematics, alongside high-speed e-learning research terminals and quiet revision alcoves.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 14,000+ Titles</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Digital E-Books</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Quiet Study Hall</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official School Noticeboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">School Bulletin & Noticeboard</h3>
                <p className="text-xs text-slate-500">Latest announcements from administration, academic dean, and games department</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View all notices in student dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 4).map((ann) => (
              <div 
                key={ann.id}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className={`px-2 py-0.5 rounded-md font-semibold ${
                    ann.category === 'Exam' ? 'bg-rose-50 text-rose-700' :
                    ann.category === 'Academic' ? 'bg-blue-50 text-blue-700' :
                    ann.category === 'Administrative' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{ann.date}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                <div className="text-[11px] text-slate-400 pt-1">Issued by: {ann.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* House System & Co-Curriculars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase">Student Community</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              The Four Houses of St. Mary's
            </h3>
            <p className="text-xs text-slate-500">
              Fostering camaraderie, athletic pride, debate prowess, and mutual pastoral support.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-center space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold mx-auto flex items-center justify-center text-xs">
                SP
              </div>
              <div className="font-bold text-slate-900 text-sm">St. Patrick House</div>
              <div className="text-[11px] text-slate-500">Color: Royal Blue · Mascot: Falcon</div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 text-center space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold mx-auto flex items-center justify-center text-xs">
                AN
              </div>
              <div className="font-bold text-slate-900 text-sm">Archbishop Ndingi</div>
              <div className="text-[11px] text-slate-500">Color: Emerald Green · Mascot: Lion</div>
            </div>

            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 text-center space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold mx-auto flex items-center justify-center text-xs">
                MT
              </div>
              <div className="font-bold text-slate-900 text-sm">Mother Teresa House</div>
              <div className="text-[11px] text-slate-500">Color: Golden Amber · Mascot: Eagle</div>
            </div>

            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 text-center space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white font-bold mx-auto flex items-center justify-center text-xs">
                SJ
              </div>
              <div className="font-bold text-slate-900 text-sm">St. Jude House</div>
              <div className="text-[11px] text-slate-500">Color: Crimson Red · Mascot: Phoenix</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
