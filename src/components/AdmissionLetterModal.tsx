import React from 'react';
import { Printer, X, GraduationCap, Award, ShieldCheck } from 'lucide-react';
import { StudentRecord } from '../types';

interface AdmissionLetterModalProps {
  student: StudentRecord;
  onClose: () => void;
}

export const AdmissionLetterModal: React.FC<AdmissionLetterModalProps> = ({
  student,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl animate-fade-in border border-slate-200 space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Official Admission Letter Document</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 text-slate-900 font-sans p-2">
          {/* Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <GraduationCap className="w-7 h-7" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                ST. MARY'S SECONDARY SCHOOL
              </h1>
            </div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Labor Omnia Vincit · Excellence in Knowledge & Character
            </div>
            <div className="text-[11px] text-slate-500">
              P.O. Box 450 - 00200 Nairobi, Kenya · Tel: +254 (0) 20 445 9200 · Email: info@stmarys.ac.ke
            </div>
            <div className="text-[10px] text-slate-400">
              Ministry of Education Registration No: MOE/SEC/39420/84
            </div>
          </div>

          {/* Letter Metadata */}
          <div className="flex justify-between text-xs text-slate-600 border-b border-slate-100 pb-3">
            <div>
              <span>Ref No: </span>
              <strong className="text-slate-900 font-mono">{student.admissionNo}</strong>
            </div>
            <div>
              <span>Date: </span>
              <strong>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
          </div>

          {/* Addressee */}
          <div className="space-y-0.5 text-xs text-slate-800">
            <div>To: <strong>{student.fullName}</strong></div>
            <div>C/O: {student.guardianName} ({student.guardianRelation})</div>
            <div>Address: {student.address}</div>
            <div>Contact: {student.phone}</div>
          </div>

          {/* Letter Title */}
          <div className="text-center py-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase underline decoration-2 underline-offset-4">
              RE: LETTER OF ADMISSION & OFFICIAL PROVISIONAL ENROLMENT
            </h2>
          </div>

          {/* Letter Content */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              Following your successful online application, I have the pleasure to inform you that you have been offered provisional admission into <strong>{student.formClass} ({student.stream} Stream)</strong> at St. Mary's Secondary School for the academic year <strong>{student.admissionYear}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Enrolment Category:</span>
                <strong className="text-slate-900">{student.studyMode}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Allocated School House:</span>
                <strong className="text-slate-900">{student.house} House</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Co-Curricular Club:</span>
                <strong className="text-slate-900">{student.club}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Term Fee Assessment:</span>
                <strong className="text-slate-900 font-mono">KES {student.totalFees.toLocaleString()}</strong>
              </div>
            </div>

            <p>
              You are required to present yourself at the school admissions hall accompanied by your parent/guardian on the official reporting date with this letter, original birth certificate, and bank deposit receipt for term tuition fees.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="font-serif italic text-base text-blue-900">Dr. Elizabeth Kiprono</div>
              <div className="border-t border-slate-400 w-48 pt-1">
                <div className="font-bold text-slate-900">Dr. Elizabeth Kiprono, Ph.D.</div>
                <div className="text-slate-500 text-[11px]">Chief Principal & Secretary to B.O.M</div>
              </div>
            </div>

            {/* School Seal Graphic */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-700/60 flex flex-col items-center justify-center text-center p-1 text-[9px] text-blue-800 rotate-[-8deg] font-bold">
              <span>ST. MARY'S</span>
              <Award className="w-4 h-4 my-0.5" />
              <span>OFFICIAL SEAL</span>
              <span className="text-[8px] font-normal">APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
