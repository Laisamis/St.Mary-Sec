import React from 'react';
import { StudentRecord } from '../types';
import { 
  GraduationCap, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  LogOut, 
  FileCode2,
  BookOpen,
  UserPlus,
  LogIn,
  Home
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: {
    role: 'guest' | 'student' | 'admin';
    student?: StudentRecord;
    adminName?: string;
  };
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-6 hidden sm:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="text-amber-400 font-semibold tracking-wide">Motto: Labor Omnia Vincit</span>
          <span className="text-slate-500">|</span>
          <span>St. Mary's Secondary School · Est. 1984</span>
          <span className="text-slate-500">|</span>
          <span>Nairobi, Kenya</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Admissions 2026/2027 Open</span>
          <span className="text-slate-600">|</span>
          <button 
            onClick={() => handleNavClick('php-docs')}
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>PHP & MS Access Code</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-hidden group whitespace-nowrap shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span>St. Mary's Secondary</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Student & Academic Portal</p>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors flex items-center gap-1.5 pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'home' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent hover:text-blue-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('academics')}
            className={`transition-colors flex items-center gap-1.5 pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'academics' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent hover:text-blue-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curriculum & Subjects</span>
          </button>

          <button
            onClick={() => handleNavClick('register')}
            className={`transition-colors flex items-center gap-1.5 pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'register' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent hover:text-blue-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Student Registration</span>
          </button>

          <button
            onClick={() => handleNavClick('php-docs')}
            className={`transition-colors flex items-center gap-1.5 pb-1 border-b-2 whitespace-nowrap ${
              activeTab === 'php-docs' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent hover:text-blue-600'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>PHP & Access DB</span>
          </button>

          {/* Role-specific Dashboard Tab */}
          {currentUser.role === 'student' && (
            <button
              onClick={() => handleNavClick('student-dashboard')}
              className={`transition-colors flex items-center gap-1.5 pb-1 border-b-2 whitespace-nowrap ${
                activeTab === 'student-dashboard' 
                  ? 'border-blue-600 text-blue-600 font-bold' 
                  : 'border-transparent hover:text-blue-600'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Student Portal</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`transition-colors flex items-center gap-1.5 pb-1 border-b-2 whitespace-nowrap ${
                activeTab === 'admin-dashboard' 
                  ? 'border-blue-600 text-blue-600 font-bold' 
                  : 'border-transparent hover:text-blue-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Right Action Zone */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {currentUser.role === 'guest' ? (
            <button
              onClick={() => handleNavClick('login')}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span>Portal Login</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick(currentUser.role === 'student' ? 'student-dashboard' : 'admin-dashboard')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5"
              >
                {currentUser.role === 'student' ? (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>{currentUser.student?.fullName.split(' ')[0]} ({currentUser.student?.formClass})</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin: Dr. Kiprono</span>
                  </>
                )}
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {currentUser.role !== 'guest' && (
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-600"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('academics')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'academics' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curriculum & Subjects</span>
          </button>

          <button
            onClick={() => handleNavClick('register')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'register' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Student Registration</span>
          </button>

          <button
            onClick={() => handleNavClick('php-docs')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'php-docs' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>PHP & MS Access Backend Code</span>
          </button>

          {currentUser.role === 'student' && (
            <button
              onClick={() => handleNavClick('student-dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'student-dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student Dashboard ({currentUser.student?.admissionNo})</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'admin-dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard Console</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            {currentUser.role === 'guest' ? (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Portal</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
