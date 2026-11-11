export type UserRole = 'guest' | 'student' | 'admin';

export interface StudentRecord {
  id: string;
  admissionNo: string;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  nationalIdOrBirthCert: string;
  email: string;
  phone: string;
  address: string;
  formClass: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';
  stream: 'East' | 'West' | 'North' | 'Blue';
  studyMode: 'Boarder' | 'Day Scholar';
  previousSchool: string;
  admissionYear: number;
  house: 'St. Patrick' | 'Archbishop Ndingi' | 'Mother Teresa' | 'St. Jude';
  club: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  password?: string;
  registeredAt: string;
  status: 'Active' | 'Pending Review' | 'Suspended';
  feeBalance: number;
  totalFees: number;
  profilePhoto?: string;
}

export interface SubjectGrade {
  subjectCode: string;
  subjectName: string;
  score: number; // 0 - 100
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'E';
  remarks: string;
  teacher: string;
}

export interface StudentReportCard {
  studentId: string;
  admissionNo: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  academicYear: number;
  formClass: string;
  grades: SubjectGrade[];
  meanScore: number;
  meanGrade: string;
  classRank: number;
  outOfRank: number;
  classTeacherRemarks: string;
  principalRemarks: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Sports & Events' | 'Administrative' | 'Exam';
  date: string;
  author: string;
  content: string;
  isImportant?: boolean;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  receiptNo: string;
  date: string;
  description: string;
  amount: number;
  type: 'Payment' | 'Charge';
  balanceAfter: number;
}

export interface TimetableSlot {
  time: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  subject: string;
  teacher: string;
  room: string;
}
