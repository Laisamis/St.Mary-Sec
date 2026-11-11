import React from 'react';
import { 
  BookOpen, 
  Atom, 
  Globe, 
  Cpu, 
  Check, 
  FileText, 
  Award, 
  Layers, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { SCHOOL_COURSES } from '../data/initialData';

interface CoursesSectionProps {
  onNavigate: (tab: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onNavigate }) => {
  const [selectedDept, setSelectedDept] = React.useState('DEPT-SCI');

  const activeDepartment = SCHOOL_COURSES.find(d => d.code === selectedDept) || SCHOOL_COURSES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Secondary School Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-heading">
          Academic Departments & Subject Clusters
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          St. Mary's Secondary School delivers the 4-tier secondary education syllabus (Form 1 through Form 4), offering balanced competencies across science, mathematics, literature, humanities, and digital technology.
        </p>
      </div>

      {/* Class Level Progression Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase">Year 9 Equivalent</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">Level 1</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Form 1 (Freshman)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Foundation year. Students undertake all 11 core and elective introductory subjects before specializing in Form 3.
          </p>
          <div className="text-xs text-slate-500 font-medium">11 Subjects · Laboratory Orientations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">Year 10 Equivalent</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Level 2</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Form 2 (Sophomore)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Intermediate mastery. Deepening scientific theory, algebraic concepts, essay articulation, and foreign language fluency.
          </p>
          <div className="text-xs text-slate-500 font-medium">Career Pathways · Inter-School Debates</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">Year 11 Equivalent</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700">Level 3</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Form 3 (Junior)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Subject cluster specialization: students select their 8 or 9 examination subjects across sciences, humanities, or technicals.
          </p>
          <div className="text-xs text-slate-500 font-medium">Cluster Selection · Science Congress</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 uppercase">Year 12 Candidate</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700">Level 4</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Form 4 (Candidate)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Graduation and National Examination revision clinics, university preparation, and leadership capstones.
          </p>
          <div className="text-xs text-slate-500 font-medium">National Mocks · University Mentorship</div>
        </div>
      </div>

      {/* Department Interactive Explorer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">Departmental Subject Explorer</h2>
            <p className="text-xs sm:text-sm text-slate-500">Select a faculty department to review subject syllabi and learning outcomes</p>
          </div>
          <button
            onClick={() => onNavigate('register')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Apply for Admission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          {SCHOOL_COURSES.map((dept) => {
            const isSelected = dept.code === selectedDept;
            return (
              <button
                key={dept.code}
                onClick={() => setSelectedDept(dept.code)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  isSelected 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept.icon === 'Atom' && <Atom className="w-4 h-4 text-blue-600" />}
                {dept.icon === 'BookOpen' && <BookOpen className="w-4 h-4 text-emerald-600" />}
                {dept.icon === 'Globe' && <Globe className="w-4 h-4 text-amber-600" />}
                {dept.icon === 'Cpu' && <Cpu className="w-4 h-4 text-indigo-600" />}
                <span className="truncate">{dept.title.replace('Department of ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Active Department Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-2">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{activeDepartment.code}</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">{activeDepartment.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{activeDepartment.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm shrink-0">
                HOD
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Head of Department</div>
                <div className="text-sm font-bold text-slate-900">{activeDepartment.head}</div>
              </div>
            </div>

            {/* Subjects in Department */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Courses & Subject Clusters</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeDepartment.subjects.map((subj, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-blue-400 transition-colors flex items-start gap-3 shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{subj}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Theory & Practicals · Continuous Assessment</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grading Rubric Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Secondary Grading Scale</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Standard secondary academic performance metrics utilized across all term evaluations and transcripts.
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-white border border-slate-200">
                <span className="font-bold text-slate-900">A (Plain)</span>
                <span className="text-slate-500">80% – 100%</span>
                <span className="font-bold text-emerald-600">Points: 12</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-white border border-slate-200">
                <span className="font-bold text-slate-900">A- (Minus)</span>
                <span className="text-slate-500">75% – 79%</span>
                <span className="font-bold text-emerald-600">Points: 11</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-white border border-slate-200">
                <span className="font-bold text-slate-900">B+ (Plus)</span>
                <span className="text-slate-500">70% – 74%</span>
                <span className="font-bold text-blue-600">Points: 10</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-white border border-slate-200">
                <span className="font-bold text-slate-900">B (Plain)</span>
                <span className="text-slate-500">65% – 69%</span>
                <span className="font-bold text-blue-600">Points: 9</span>
              </div>
              <div className="flex justify-between py-1.5 px-2.5 rounded bg-white border border-slate-200">
                <span className="font-bold text-slate-900">C+ (University Entry)</span>
                <span className="text-slate-500">55% – 59%</span>
                <span className="font-bold text-amber-600">Points: 7</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('register')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors text-center"
            >
              Enroll in Current Academic Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
