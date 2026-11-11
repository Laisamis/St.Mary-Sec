import React from 'react';
import { GraduationCap, ArrowUp, MapPin, Phone, Mail, FileCode2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-bold tracking-tight">ST. MARY'S SECONDARY SCHOOL</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Committed to holistic secondary education through academic rigor, moral character development, athletic achievement, and modern technology.
            </p>
            <div className="text-slate-500 text-[11px]">
              Motto: <span className="text-amber-400 italic">Labor Omnia Vincit</span> (Work Conquers All) · Est. 1984
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">Portal Navigation</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('academics')} className="hover:text-white transition-colors">
                  Curriculum & Subjects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition-colors">
                  Student Registration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
                  Student & Staff Login
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('php-docs')} className="hover:text-blue-400 text-blue-300 transition-colors flex items-center gap-1">
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>PHP & Access DB Scripts</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">School Contacts</div>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span>P.O. Box 450 - 00200, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+254 (0) 20 445 9200 / 0722 000 111</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>info@stmarys.ac.ke / admissions@stmarys.ac.ke</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {currentYear} St. Mary's Secondary School. All rights reserved. Registered under Ministry of Education (Reg. #39420).
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
