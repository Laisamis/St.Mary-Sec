import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Trash2, 
  UserPlus, 
  Download, 
  Bell, 
  BookOpen, 
  Database, 
  DollarSign, 
  Eye, 
  Edit, 
  LogOut, 
  CheckCircle2, 
  Filter,
  Printer
} from 'lucide-react';
import { StudentRecord, Announcement } from '../types';

interface AdminDashboardProps {
  students: StudentRecord[];
  onDeleteStudent: (id: string) => void;
  onAddStudent: (student: StudentRecord) => void;
  onUpdateStudent: (student: StudentRecord) => void;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onLogout: () => void;
  onViewAdmissionLetter: (student: StudentRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  onDeleteStudent,
  onAddStudent,
  onUpdateStudent,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onLogout,
  onViewAdmissionLetter
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'notices' | 'marks' | 'database'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterMode, setFilterMode] = useState('All');

  // Selected student for viewing / editing in modal
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Notice Creator State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Sports & Events' | 'Administrative' | 'Exam'>('Academic');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('Dr. Elizabeth Kiprono (Principal)');

  // Filter students
  const filteredStudents = students.filter(student => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      student.fullName.toLowerCase().includes(q) ||
      student.admissionNo.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.phone.includes(q);

    const matchesClass = filterClass === 'All' || student.formClass === filterClass;
    const matchesMode = filterMode === 'All' || student.studyMode === filterMode;

    return matchesSearch && matchesClass && matchesMode;
  });

  // Calculate high-level stats
  const totalStudents = students.length;
  const boardersCount = students.filter(s => s.studyMode === 'Boarder').length;
  const dayCount = students.filter(s => s.studyMode === 'Day Scholar').length;
  const totalFeesAssessed = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalOutstandingBalance = students.reduce((sum, s) => sum + s.feeBalance, 0);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Admission No',
      'Full Name',
      'Class',
      'Stream',
      'Study Mode',
      'Email',
      'Phone',
      'Date of Birth',
      'Gender',
      'House',
      'Guardian Name',
      'Guardian Phone',
      'Fee Balance',
      'Total Fees',
      'Status'
    ];

    const rows = filteredStudents.map(s => [
      `"${s.admissionNo}"`,
      `"${s.fullName}"`,
      `"${s.formClass}"`,
      `"${s.stream}"`,
      `"${s.studyMode}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.dob}"`,
      `"${s.gender}"`,
      `"${s.house}"`,
      `"${s.guardianName}"`,
      `"${s.guardianPhone}"`,
      s.feeBalance,
      s.totalFees,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `st_marys_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const newNotice: Announcement = {
      id: 'ann-' + Date.now(),
      title: noticeTitle.trim(),
      category: noticeCategory,
      date: new Date().toISOString().slice(0, 10),
      author: noticeAuthor.trim(),
      content: noticeContent.trim(),
      isImportant: true
    };

    onAddAnnouncement(newNotice);
    setNoticeTitle('');
    setNoticeContent('');
    alert('Announcement published successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                Principal & Administration Office
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              St. Mary's School Management Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Administrator: <strong>Dr. Elizabeth Kiprono</strong> · Academic Year 2026/2027
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Total Enrolled</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono-numbers">
            {totalStudents}
          </strong>
          <div className="text-[11px] text-slate-400">Active student files</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Boarding Students</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono-numbers">
            {boardersCount}
          </strong>
          <div className="text-[11px] text-slate-400">Residential hostel capacity</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Day Scholars</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono-numbers">
            {dayCount}
          </strong>
          <div className="text-[11px] text-slate-400">Commuter bus routes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">Total Outstanding Fees</span>
          <strong className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            KES {totalOutstandingBalance.toLocaleString()}
          </strong>
          <div className="text-[11px] text-slate-400">Collectable balance</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 sm:gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'students' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory & Enrolment ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'notices' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Post Announcements</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'database' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MS Access Tables Explorer</span>
        </button>
      </div>

      {/* Tab 1: Student Directory */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Action & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, admission #, email or phone..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              {/* Class Filter */}
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="All">All Classes</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>

              {/* Mode Filter */}
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="All">All Modes</option>
                <option value="Boarder">Boarders</option>
                <option value="Day Scholar">Day Scholars</option>
              </select>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                title="Export filtered records to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll New Student</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Admission #</th>
                  <th className="py-3 px-4 font-bold">Student Name</th>
                  <th className="py-3 px-4 font-bold">Class & Stream</th>
                  <th className="py-3 px-4 font-bold">Mode</th>
                  <th className="py-3 px-4 font-bold">House</th>
                  <th className="py-3 px-4 font-bold">Guardian Contact</th>
                  <th className="py-3 px-4 font-bold text-right">Fee Balance</th>
                  <th className="py-3 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.admissionNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {s.fullName}
                        <div className="text-[11px] text-slate-400 font-normal">{s.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{s.formClass} ({s.stream})</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.studyMode === 'Boarder' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {s.studyMode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{s.house}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        <div>{s.guardianName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{s.guardianPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        KES {s.feeBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View student dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onViewAdmissionLetter(s)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Print Admission Letter"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete the student record for ${s.fullName} (${s.admissionNo})?`)) {
                                onDeleteStudent(s.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs sm:text-sm">
                      No student records match the search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Announcements Manager */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-heading">Post New School Notice</h3>
            <p className="text-xs text-slate-500">Notices published here display immediately on the Student Portal and Landing Page.</p>

            <form onSubmit={handlePostNotice} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. End of Term Closing Date & Bus Schedules"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden bg-white"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exam">Examination</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Sports & Events">Sports & Events</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issuer / Department</label>
                <input
                  type="text"
                  value={noticeAuthor}
                  onChange={(e) => setNoticeAuthor(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Body Text</label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Type the announcement details here..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                Publish Notice to School
              </button>
            </form>
          </div>

          {/* Existing Notices List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-heading">Active School Bulletins ({announcements.length})</h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-blue-700">{ann.category}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{ann.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600">{ann.content}</p>
                    <div className="text-[11px] text-slate-400">Author: {ann.author}</div>
                  </div>

                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MS Access Live Tables Explorer */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Microsoft Access (*.accdb) Simulated Live Tables
              </h3>
              <p className="text-xs text-slate-500">
                Visual representation of backend tables queried by PHP ODBC drivers
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              ODBC Driver: Microsoft Access (*.mdb, *.accdb)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-700 block">tbl_Students</span>
              <strong className="text-xl text-slate-900">{students.length} rows</strong>
              <div className="text-[11px] text-slate-500">Primary Key: student_id (AutoNumber)</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700 block">tbl_Admins</span>
              <strong className="text-xl text-slate-900">1 row</strong>
              <div className="text-[11px] text-slate-500">Primary Key: admin_id (AutoNumber)</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-mono font-bold text-amber-700 block">tbl_Marks</span>
              <strong className="text-xl text-slate-900">{students.length * 8} rows</strong>
              <div className="text-[11px] text-slate-500">Foreign Key: student_id</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-xs font-mono font-bold text-purple-700 block">tbl_Announcements</span>
              <strong className="text-xl text-slate-900">{announcements.length} rows</strong>
              <div className="text-[11px] text-slate-500">Primary Key: announcement_id</div>
            </div>
          </div>

          {/* SQL Query Snippet */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="text-slate-400 text-[11px]">// Sample PHP Access ODBC Query Executed:</div>
            <code className="text-emerald-400">
              SELECT s.admission_no, s.full_name, s.form_class, s.study_mode, s.fee_balance, <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COUNT(m.mark_id) AS total_subjects_graded <br />
              FROM tbl_Students s LEFT JOIN tbl_Marks m ON s.student_id = m.student_id <br />
              WHERE s.status = 'Active' <br />
              GROUP BY s.student_id, s.admission_no, s.full_name, s.form_class, s.study_mode, s.fee_balance;
            </code>
          </div>
        </div>
      )}

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono text-blue-600">{selectedStudent.admissionNo}</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedStudent.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Class & Stream</span>
                <span className="font-bold text-slate-800">{selectedStudent.formClass} ({selectedStudent.stream})</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Study Mode</span>
                <span className="font-bold text-slate-800">{selectedStudent.studyMode}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">House</span>
                <span className="font-bold text-slate-800">{selectedStudent.house}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Club</span>
                <span className="font-bold text-slate-800">{selectedStudent.club}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Email</span>
                <span className="font-semibold text-slate-800 truncate block">{selectedStudent.email}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-800">{selectedStudent.phone}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Guardian</span>
                <span className="font-semibold text-slate-800">{selectedStudent.guardianName}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Guardian Phone</span>
                <span className="font-semibold text-slate-800">{selectedStudent.guardianPhone}</span>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-400 block">Outstanding Fee Balance</span>
                <span className="font-mono font-bold text-base text-amber-700">KES {selectedStudent.feeBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onViewAdmissionLetter(selectedStudent);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Direct Student Enrollment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const formClass = (form.elements.namedItem('formClass') as HTMLSelectElement).value as any;
                const mode = (form.elements.namedItem('studyMode') as HTMLSelectElement).value as any;

                const newStudent: StudentRecord = {
                  id: 'std-' + Date.now(),
                  admissionNo: `SMSS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
                  fullName: name,
                  dob: '2010-01-01',
                  gender: 'Male',
                  nationalIdOrBirthCert: `BC-${Math.floor(1000000 + Math.random() * 9000000)}`,
                  email,
                  phone: '0700 000 000',
                  address: 'P.O. Box 450, Nairobi',
                  formClass,
                  stream: 'East',
                  studyMode: mode,
                  previousSchool: 'Primary School',
                  admissionYear: new Date().getFullYear(),
                  house: 'St. Patrick',
                  club: 'Science Club',
                  guardianName: 'Parent / Guardian',
                  guardianPhone: '0722 000 000',
                  guardianRelation: 'Parent',
                  password: 'Password123',
                  registeredAt: new Date().toISOString(),
                  status: 'Active',
                  feeBalance: mode === 'Boarder' ? 48000 : 36000,
                  totalFees: mode === 'Boarder' ? 48000 : 36000
                };

                onAddStudent(newStudent);
                setIsAddModalOpen(false);
                alert(`Student enrolled successfully with Adm No: ${newStudent.admissionNo}`);
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
                <input name="name" required placeholder="Full Name" className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input name="email" type="email" required placeholder="student@example.com" className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Level</label>
                <select name="formClass" className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden bg-white">
                  <option value="Form 1">Form 1</option>
                  <option value="Form 2">Form 2</option>
                  <option value="Form 3">Form 3</option>
                  <option value="Form 4">Form 4</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Study Mode</label>
                <select name="studyMode" className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden bg-white">
                  <option value="Boarder">Boarder</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
