import React, { useState } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Printer, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Bell, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3,
  Download,
  QrCode
} from 'lucide-react';
import { StudentRecord, Announcement, TimetableSlot } from '../types';
import { DEFAULT_TIMETABLE, getSampleReportCard, SAMPLE_FEE_TRANSACTIONS } from '../data/initialData';

interface StudentDashboardProps {
  student: StudentRecord;
  onLogout: () => void;
  announcements: Announcement[];
  onViewAdmissionLetter: (student: StudentRecord) => void;
  onUpdateStudent: (updated: StudentRecord) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onLogout,
  announcements,
  onViewAdmissionLetter,
  onUpdateStudent
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'timetable' | 'fees' | 'notices'>('profile');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [phoneInput, setPhoneInput] = useState(student.phone);
  const [addressInput, setAddressInput] = useState(student.address);
  const [guardianPhoneInput, setGuardianPhoneInput] = useState(student.guardianPhone);

  const reportCard = getSampleReportCard(student);
  const feeTransactions = SAMPLE_FEE_TRANSACTIONS.filter(f => f.studentId === student.id || student.id === 'std-101');

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({
      ...student,
      phone: phoneInput,
      address: addressInput,
      guardianPhone: guardianPhoneInput
    });
    setIsEditingContact(false);
  };

  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const dailySlots = DEFAULT_TIMETABLE.filter(slot => slot.day === selectedDay);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-700 text-white font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
            {student.fullName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {student.formClass} ({student.stream})
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {student.studyMode}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {student.house} House
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              {student.fullName}
            </h1>
            <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-3">
              <span>Adm No: <strong className="text-slate-800 font-mono">{student.admissionNo}</strong></span>
              <span>·</span>
              <span>Admitted: {student.admissionYear}</span>
              <span>·</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Enrolled & Active</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button
            onClick={() => onViewAdmissionLetter(student)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Admission Slip</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 sm:gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Student Card</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'results' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic Report Card</span>
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'timetable' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Class Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'fees' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fee Statement</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'notices' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>School Notices</span>
        </button>
      </div>

      {/* Tab 1: Profile & Digital Student ID Card */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Digital Student ID Card */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
                  SM
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider">ST. MARY'S SECONDARY</div>
                  <div className="text-[10px] text-blue-300">STUDENT IDENTITY CARD</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 font-mono">
                2026/2027
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-24 rounded-xl bg-blue-950/80 border border-white/20 flex flex-col items-center justify-center text-center p-2 shrink-0">
                <User className="w-10 h-10 text-blue-300" />
                <span className="text-[9px] text-slate-300 mt-1 uppercase">Photo ID</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-sm font-bold text-white">{student.fullName}</div>
                <div className="text-blue-200 font-mono text-xs">{student.admissionNo}</div>
                <div className="text-[11px] text-slate-300">{student.formClass} · {student.stream} Stream</div>
                <div className="text-[11px] text-amber-300">{student.house} House</div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between text-xs backdrop-blur-xs">
              <div>
                <span className="text-[10px] text-blue-200 block">Status & Mode:</span>
                <span className="font-semibold">{student.studyMode} · Active</span>
              </div>
              <div className="w-8 h-8 rounded bg-white p-1 text-slate-900 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2 bg-white text-blue-950 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Student ID Card</span>
            </button>
          </div>

          {/* Student Dossier Information */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Personal & Enrolment Records</h3>
                <p className="text-xs text-slate-500">Official student registry data on file</p>
              </div>
              <button
                onClick={() => setIsEditingContact(!isEditingContact)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingContact ? 'Cancel' : 'Update Contacts'}</span>
              </button>
            </div>

            {isEditingContact ? (
              <form onSubmit={handleSaveContact} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student Phone Number</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Emergency Phone</label>
                    <input
                      type="text"
                      value={guardianPhoneInput}
                      onChange={(e) => setGuardianPhoneInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Postal / Residential Address</label>
                    <input
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Full Name</span>
                  <span className="font-bold text-slate-900">{student.fullName}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Admission Number</span>
                  <span className="font-mono font-bold text-blue-700">{student.admissionNo}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Date of Birth & Gender</span>
                  <span className="font-semibold text-slate-800">{student.dob} ({student.gender})</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Birth Cert / NEMIS Number</span>
                  <span className="font-mono font-semibold text-slate-800">{student.nationalIdOrBirthCert}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Student Email</span>
                  <span className="font-semibold text-slate-800">{student.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Student Phone</span>
                  <span className="font-semibold text-slate-800">{student.phone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Guardian / Sponsor</span>
                  <span className="font-semibold text-slate-800">{student.guardianName} ({student.guardianRelation})</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Emergency Guardian Contact</span>
                  <span className="font-semibold text-slate-800">{student.guardianPhone}</span>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-xs block">Permanent Address</span>
                  <span className="font-semibold text-slate-800">{student.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Academic Report Card */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase">
                <Award className="w-4 h-4" />
                <span>Term Academic Performance</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {reportCard.term} Examination Report Slip ({reportCard.academicYear})
              </h3>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Report Card</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
              <span className="text-xs text-blue-700 font-semibold block">Mean Score</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-mono-numbers">{reportCard.meanScore}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-xs text-emerald-700 font-semibold block">Mean Grade</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">{reportCard.meanGrade} (Plain)</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-xs text-amber-800 font-semibold block">Stream Rank</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono-numbers">{reportCard.classRank} <span className="text-sm font-normal text-slate-500">of {reportCard.outOfRank}</span></span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-center">
              <span className="text-xs text-purple-700 font-semibold block">Subjects Graded</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-mono-numbers">{reportCard.grades.length}</span>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Code</th>
                  <th className="py-3 px-4 font-bold">Subject</th>
                  <th className="py-3 px-4 font-bold text-center">Score (%)</th>
                  <th className="py-3 px-4 font-bold text-center">Grade</th>
                  <th className="py-3 px-4 font-bold">Instructor Remarks</th>
                  <th className="py-3 px-4 font-bold">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportCard.grades.map((grade) => (
                  <tr key={grade.subjectCode} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">{grade.subjectCode}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{grade.subjectName}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">{grade.score}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                        grade.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                        grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{grade.remarks}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{grade.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comments from Teachers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Class Teacher Remarks:</span>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{reportCard.classTeacherRemarks}"</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Principal's Remarks:</span>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{reportCard.principalRemarks}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Class Timetable */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Weekly Academic Schedule & Timetable
              </h3>
              <p className="text-xs text-slate-500">
                Class: {student.formClass} ({student.stream} Stream) · Academic Term 2
              </p>
            </div>

            {/* Day Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedDay === day ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailySlots.map((slot, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-white transition-all space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-semibold flex items-center gap-1 text-blue-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot.time}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-semibold">
                    {slot.room}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900">{slot.subject}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Teacher: {slot.teacher}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Fee Statement */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Student Fee Statement</h3>
              <p className="text-xs text-slate-500">Official fee ledger and remittance records</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download Fee Statement</span>
            </button>
          </div>

          {/* Fee Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block">Total Term Assessment</span>
              <strong className="text-xl sm:text-2xl text-slate-900 font-mono-numbers">
                KES {student.totalFees.toLocaleString()}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-700 block">Total Payments Received</span>
              <strong className="text-xl sm:text-2xl text-emerald-800 font-mono-numbers">
                KES {(student.totalFees - student.feeBalance).toLocaleString()}
              </strong>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs text-amber-800 block">Outstanding Fee Balance</span>
              <strong className="text-xl sm:text-2xl text-amber-900 font-mono-numbers">
                KES {student.feeBalance.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Receipt / Ref #</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Transaction Description</th>
                  <th className="py-3 px-4 font-bold text-center">Type</th>
                  <th className="py-3 px-4 font-bold text-right">Amount (KES)</th>
                  <th className="py-3 px-4 font-bold text-right">Running Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{tx.receiptNo}</td>
                    <td className="py-3 px-4 text-slate-600">{tx.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{tx.description}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        tx.type === 'Payment' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {tx.type === 'Payment' ? '-' : '+'} KES {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      KES {tx.balanceAfter.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-1">
            <strong>Fee Payment Instructions:</strong>
            <p>
              Direct bank deposit: <strong>KCB Bank (St. Mary's School Account #1102948201)</strong> or via <strong>M-Pesa Paybill: 400200, Account: {student.admissionNo}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: School Notices */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Official School Bulletins & Notifications
            </h3>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700">{ann.category}</span>
                    <span className="text-slate-500">{ann.date} · {ann.author}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
