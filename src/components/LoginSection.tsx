import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  ShieldCheck, 
  User, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  KeyRound,
  Check
} from 'lucide-react';
import { StudentRecord } from '../types';

interface LoginSectionProps {
  onLoginSuccess: (role: 'student' | 'admin', student?: StudentRecord, adminName?: string) => void;
  onNavigateToRegister: () => void;
  students: StudentRecord[];
  initialEmail?: string;
}

export const LoginSection: React.FC<LoginSectionProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  students,
  initialEmail = ''
}) => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [identifier, setIdentifier] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialEmail) {
      setIdentifier(initialEmail);
      setRole('student');
    }
  }, [initialEmail]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanId = identifier.trim().toLowerCase();

    if (role === 'admin') {
      // Check admin credentials
      if (
        (cleanId === 'admin@stmarys.ac.ke' || cleanId === 'admin@portal.test' || cleanId === 'admin') &&
        (password === 'Admin123' || password === 'admin')
      ) {
        onLoginSuccess('admin', undefined, 'Dr. Elizabeth Kiprono');
      } else {
        setErrorMsg('Invalid administrator credentials. Try demo: admin@stmarys.ac.ke / Admin123');
      }
    } else {
      // Check student credentials by email or admission number
      const foundStudent = students.find(s => 
        s.email.toLowerCase() === cleanId || 
        s.admissionNo.toLowerCase() === cleanId
      );

      if (!foundStudent) {
        setErrorMsg('No student found with that email or admission number. Please check or register first.');
        return;
      }

      // Check password (allow custom password or default "Password123")
      if (foundStudent.password && foundStudent.password !== password && password !== 'Password123') {
        setErrorMsg('Incorrect password. Please verify your password entry.');
        return;
      }

      onLoginSuccess('student', foundStudent);
    }
  };

  const handleQuickDemoStudent = (email: string) => {
    setRole('student');
    setIdentifier(email);
    setPassword('Password123');
    setErrorMsg('');
  };

  const handleQuickDemoAdmin = () => {
    setRole('admin');
    setIdentifier('admin@stmarys.ac.ke');
    setPassword('Admin123');
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
          Portal Sign In
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Access your academic records, timetables, and school management
        </p>
      </div>

      {/* Role Toggle */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => { setRole('student'); setErrorMsg(''); }}
          className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            role === 'student' 
              ? 'bg-white text-blue-700 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Student Login</span>
        </button>

        <button
          type="button"
          onClick={() => { setRole('admin'); setErrorMsg(''); }}
          className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            role === 'admin' 
              ? 'bg-white text-blue-700 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Administrator</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {role === 'student' ? 'Admission No. or Email' : 'Administrator Email'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={role === 'student' ? 'SMSS/2024/0142 or student@stmarys.ac.ke' : 'admin@stmarys.ac.ke'}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert("For student demo accounts use 'Password123'. For admin use 'Admin123'.")}
                className="text-[11px] text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to {role === 'student' ? 'Student Portal' : 'Admin Console'}</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            New to St. Mary's Secondary School?{' '}
            <button
              onClick={onNavigateToRegister}
              className="font-bold text-blue-600 hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      {/* Preset Demo Logins Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>One-Click Instant Demo Credentials</span>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleQuickDemoStudent('kevin.otieno@student.stmarys.ac.ke')}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200/90 text-left hover:border-blue-400 hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <div className="font-bold text-slate-900">Kevin Otieno (Form 3 Blue)</div>
              <div className="text-[11px] text-slate-500">kevin.otieno@student.stmarys.ac.ke · Password123</div>
            </div>
            <span className="text-[11px] font-semibold text-blue-600">Fill & Test →</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoStudent('grace.wanjiku@student.stmarys.ac.ke')}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200/90 text-left hover:border-blue-400 hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <div className="font-bold text-slate-900">Grace Wanjiku (Form 4 East)</div>
              <div className="text-[11px] text-slate-500">grace.wanjiku@student.stmarys.ac.ke · Password123</div>
            </div>
            <span className="text-[11px] font-semibold text-blue-600">Fill & Test →</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200/90 text-left hover:border-blue-400 hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <div className="font-bold text-slate-900">Dr. Elizabeth Kiprono (Principal)</div>
              <div className="text-[11px] text-slate-500">admin@stmarys.ac.ke · Admin123</div>
            </div>
            <span className="text-[11px] font-semibold text-blue-600">Fill & Test →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
