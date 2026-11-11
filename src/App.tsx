import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { CoursesSection } from './components/CoursesSection';
import { RegisterSection } from './components/RegisterSection';
import { LoginSection } from './components/LoginSection';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PhpAccessDocs } from './components/PhpAccessDocs';
import { AdmissionLetterModal } from './components/AdmissionLetterModal';
import { StudentRecord, Announcement } from './types';
import { INITIAL_STUDENTS, INITIAL_ANNOUNCEMENTS } from './data/initialData';

const STORAGE_STUDENTS_KEY = 'stMarysStudents_records_v1';
const STORAGE_NOTICES_KEY = 'stMarysNotices_records_v1';
const STORAGE_AUTH_KEY = 'stMarysPortal_auth_session';

export default function App() {
  // Load saved students or initial seeds
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS;
  });

  // Load announcements or initial seeds
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTICES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{
    role: 'guest' | 'student' | 'admin';
    student?: StudentRecord;
    adminName?: string;
  }>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_AUTH_KEY);
      if (savedAuth) return JSON.parse(savedAuth);
    } catch {
      // fallback
    }
    return { role: 'guest' };
  });

  // Prefilled email for login after registration
  const [prefilledLoginEmail, setPrefilledLoginEmail] = useState<string>('');

  // Admission letter modal state
  const [admissionLetterStudent, setAdmissionLetterStudent] = useState<StudentRecord | null>(null);

  // Sync students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Sync announcements to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTICES_KEY, JSON.stringify(announcements));
    } catch (e) {
      console.error('Failed to save notices to localStorage', e);
    }
  }, [announcements]);

  // Sync auth session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
  }, [currentUser]);

  // Handlers
  const handleRegisterSuccess = (newStudent: StudentRecord) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleNavigateToLogin = (email?: string) => {
    if (email) setPrefilledLoginEmail(email);
    setActiveTab('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: 'student' | 'admin', student?: StudentRecord, adminName?: string) => {
    if (role === 'student' && student) {
      setCurrentUser({ role: 'student', student });
      setActiveTab('student-dashboard');
    } else if (role === 'admin') {
      setCurrentUser({ role: 'admin', adminName: adminName || 'Dr. Elizabeth Kiprono' });
      setActiveTab('admin-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser({ role: 'guest' });
    setActiveTab('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleAddStudent = (newStudent: StudentRecord) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: StudentRecord) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (currentUser.student?.id === updatedStudent.id) {
      setCurrentUser(prev => ({ ...prev, student: updatedStudent }));
    }
  };

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            announcements={announcements}
          />
        )}

        {activeTab === 'academics' && (
          <CoursesSection
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'register' && (
          <RegisterSection
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={handleNavigateToLogin}
            onViewAdmissionLetter={(student) => setAdmissionLetterStudent(student)}
            existingStudents={students}
          />
        )}

        {activeTab === 'login' && (
          <LoginSection
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => {
              setActiveTab('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            students={students}
            initialEmail={prefilledLoginEmail}
          />
        )}

        {activeTab === 'student-dashboard' && (
          currentUser.role === 'student' && currentUser.student ? (
            <StudentDashboard
              student={currentUser.student}
              onLogout={handleLogout}
              announcements={announcements}
              onViewAdmissionLetter={(student) => setAdmissionLetterStudent(student)}
              onUpdateStudent={handleUpdateStudent}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Student Portal Access Required</h2>
              <p className="text-xs text-slate-500">Please sign in with your student credentials or register for admission first.</p>
              <button
                onClick={() => setActiveTab('login')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Go to Login
              </button>
            </div>
          )
        )}

        {activeTab === 'admin-dashboard' && (
          currentUser.role === 'admin' ? (
            <AdminDashboard
              students={students}
              onDeleteStudent={handleDeleteStudent}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onLogout={handleLogout}
              onViewAdmissionLetter={(student) => setAdmissionLetterStudent(student)}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Administrator Credentials Required</h2>
              <p className="text-xs text-slate-500">Only authorized school staff and administrators may access this console.</p>
              <button
                onClick={() => setActiveTab('login')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Go to Login
              </button>
            </div>
          )
        )}

        {activeTab === 'php-docs' && (
          <PhpAccessDocs />
        )}
      </main>

      {/* Official Admission Letter Modal */}
      {admissionLetterStudent && (
        <AdmissionLetterModal
          student={admissionLetterStudent}
          onClose={() => setAdmissionLetterStudent(null)}
        />
      )}

      {/* Institutional Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
