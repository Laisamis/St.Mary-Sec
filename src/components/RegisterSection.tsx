import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { StudentRecord } from '../types';

interface RegisterSectionProps {
  onRegisterSuccess: (student: StudentRecord) => void;
  onNavigateToLogin: (prefilledEmail?: string) => void;
  onViewAdmissionLetter: (student: StudentRecord) => void;
  existingStudents: StudentRecord[];
}

export const RegisterSection: React.FC<RegisterSectionProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onViewAdmissionLetter,
  existingStudents
}) => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    nationalIdOrBirthCert: '',
    email: '',
    phone: '',
    address: '',
    formClass: 'Form 1' as 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4',
    stream: 'East' as 'East' | 'West' | 'North' | 'Blue',
    studyMode: 'Boarder' as 'Boarder' | 'Day Scholar',
    previousSchool: '',
    admissionYear: currentYear,
    house: 'St. Patrick' as 'St. Patrick' | 'Archbishop Ndingi' | 'Mother Teresa' | 'St. Jude',
    club: 'Science Club',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Parent / Father',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successStudent, setSuccessStudent] = useState<StudentRecord | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.dob) {
      setErrorMsg('Please provide your date of birth.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter a primary contact telephone number.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('The passwords do not match. Please verify your entries.');
      return;
    }
    if (!formData.termsAgreed) {
      setErrorMsg('Please confirm that the information provided is correct and true.');
      return;
    }

    // Check email uniqueness
    const emailExists = existingStudents.some(
      s => s.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (emailExists) {
      setErrorMsg('This email address is already registered in our portal. Please login or use another email.');
      return;
    }

    // Generate St. Mary's Admission Number: SMSS/YYYY/XXXX
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const admissionNo = `SMSS/${formData.admissionYear}/${randomSuffix}`;

    const newStudent: StudentRecord = {
      id: 'std-' + Date.now(),
      admissionNo,
      fullName: formData.fullName.trim(),
      dob: formData.dob,
      gender: formData.gender,
      nationalIdOrBirthCert: formData.nationalIdOrBirthCert.trim() || `BC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim() || 'P.O. Box 450, Nairobi',
      formClass: formData.formClass,
      stream: formData.stream,
      studyMode: formData.studyMode,
      previousSchool: formData.previousSchool.trim() || 'Primary School / Junior Secondary',
      admissionYear: Number(formData.admissionYear),
      house: formData.house,
      club: formData.club,
      guardianName: formData.guardianName.trim() || 'Guardian / Parent',
      guardianPhone: formData.guardianPhone.trim() || formData.phone.trim(),
      guardianRelation: formData.guardianRelation,
      password: formData.password,
      registeredAt: new Date().toISOString(),
      status: 'Active',
      feeBalance: formData.studyMode === 'Boarder' ? 48000 : 36000,
      totalFees: formData.studyMode === 'Boarder' ? 48000 : 36000
    };

    onRegisterSuccess(newStudent);
    setSuccessStudent(newStudent);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Official Admissions Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">
          Student Admission Registration
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Complete the admission application to enroll at St. Mary's Secondary School. All fields marked with an asterisk (<span className="text-rose-500">*</span>) are mandatory.
        </p>
      </div>

      {/* Success Banner if just registered */}
      {successStudent ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 space-y-6 text-center animate-fade-in shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Registration Successfully Completed!</h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              Welcome to St. Mary's Secondary School, <strong>{successStudent.fullName}</strong>. Your official student admission record has been entered into the school registry.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-emerald-200 inline-block text-left max-w-md w-full space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Official Admission No:</span>
              <strong className="text-blue-700 font-mono text-base">{successStudent.admissionNo}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Class & Stream:</span>
              <span className="font-semibold text-slate-800">{successStudent.formClass} ({successStudent.stream})</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Study Mode:</span>
              <span className="font-semibold text-slate-800">{successStudent.studyMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-semibold text-slate-800">{successStudent.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onViewAdmissionLetter(successStudent)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>View & Print Admission Letter</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToLogin(successStudent.email)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition-colors"
            >
              <span>Login to Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* The Registration Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">1. Personal Information</h3>
              <p className="text-xs text-slate-500">Official candidate details as recorded on Birth Certificate or NEMIS</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (Surname First) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Kiprono Brian Cheruiyot"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Birth Certificate No. / NEMIS / UPI
                </label>
                <input
                  type="text"
                  name="nationalIdOrBirthCert"
                  value={formData.nationalIdOrBirthCert}
                  onChange={handleChange}
                  placeholder="e.g. BC-9831204 or UPI"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">2. Contact Information</h3>
              <p className="text-xs text-slate-500">Student communication details and residence address</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student.name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Telephone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07XX XXX XXX"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Postal Address / Home Residence Town
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. P.O. Box 450 - 00200, Nairobi / Westlands"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic Placement */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">3. Academic Placement & Enrolment</h3>
              <p className="text-xs text-slate-500">Grade level, stream, and boarding preferences</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enrolling Class Level <span className="text-rose-500">*</span>
                </label>
                <select
                  name="formClass"
                  value={formData.formClass}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="Form 1">Form 1 (Freshman)</option>
                  <option value="Form 2">Form 2 (Sophomore)</option>
                  <option value="Form 3">Form 3 (Junior)</option>
                  <option value="Form 4">Form 4 (Candidate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stream Preference <span className="text-rose-500">*</span>
                </label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="East">East Stream</option>
                  <option value="West">West Stream</option>
                  <option value="North">North Stream</option>
                  <option value="Blue">Blue Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Study Mode <span className="text-rose-500">*</span>
                </label>
                <select
                  name="studyMode"
                  value={formData.studyMode}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="Boarder">Boarder (Residential)</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous School / Primary Institution
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  placeholder="e.g. St. Ann Junior Academy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School House Allocation
                </label>
                <select
                  name="house"
                  value={formData.house}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="St. Patrick">St. Patrick House (Blue)</option>
                  <option value="Archbishop Ndingi">Archbishop Ndingi (Green)</option>
                  <option value="Mother Teresa">Mother Teresa (Gold)</option>
                  <option value="St. Jude">St. Jude House (Red)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Extracurricular Club
                </label>
                <select
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="Science Club">Science & Robotics Club</option>
                  <option value="Debate Society">Debate & Model UN</option>
                  <option value="Drama Club">Drama & Music Ensemble</option>
                  <option value="Scouts">Kenya Scouts Movement</option>
                  <option value="Red Cross">Red Cross & St. John Ambulance</option>
                  <option value="Football">Varsity Football Team</option>
                  <option value="Basketball">Basketball Team</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Parent / Guardian Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">4. Parent / Guardian Information</h3>
              <p className="text-xs text-slate-500">Official emergency contact and fee sponsor</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guardian Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="e.g. Mary Wambui Kamau"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relationship <span className="text-rose-500">*</span>
                </label>
                <select
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                  <option value="Next of Kin">Next of Kin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  placeholder="07XX XXX XXX"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Portal Account Password */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">5. Portal Account Security</h3>
              <p className="text-xs text-slate-500">Create your secure password for logging into the student dashboard</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  placeholder="Re-enter same password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                required
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 leading-normal">
                I hereby declare that all information supplied in this registration is true and correct to the best of my knowledge, and agree to abide by the rules and code of conduct of St. Mary's Secondary School.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Your official St. Mary's Admission Number will be generated automatically upon submission.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Submit Admission Application</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
