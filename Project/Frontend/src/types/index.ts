export type UserRole = 'AWW' | 'ADMIN';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Beneficiary {
  _id: string;
  name: string;
  age: number;
  phone: string;
  height: number;
  weight: number;
  monthOfPregnancy: number;
  pregnancyNumber: number;
  pregnancyType: 'NORMAL' | 'OPERATION';
  guardianName: string;
  guardianRelation: string;
  status: 'ACTIVE' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionAnswer {
  questionId: string;
  questionText?: string;
  answer: string;
}

export interface CounsellingSession {
  _id: string;
  beneficiary: string | Beneficiary;
  aww: string | User;
  tier: 1 | 2 | 3;
  answers: QuestionAnswer[];
  counsellingDate: string;
  attendance: boolean;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt?: string;
}

export interface DecisionTreeResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  actions: string[];
}

export interface BeneficiaryFeedback {
  rating: number;
  comment?: string;
  submittedAt?: string;
}

export interface CounsellingEligibility {
  eligible: boolean;
  reason?: 'IN_PROGRESS' | 'COOLDOWN';
  message?: string;
  nextAvailableDate?: string;
  lastSessionDate?: string;
  sessionId?: string;
}

export interface Report {
  _id: string;
  counselling: string | CounsellingSession;
  beneficiary: string | Beneficiary;
  aww: string | User;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  actions: string[];
  aiGuidance: string;
  reportDate: string;
  createdAt?: string;
  beneficiaryFeedback?: BeneficiaryFeedback;
}

export interface Rule {
  _id: string;
  tier: 1 | 2 | 3;
  questionId: string;
  expectedAnswer: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  action: string;
}

export interface Milestone {
  _id: string;
  name: string;
  minCounselling: number;
  maxCounselling: number;
  reward: string;
}

export interface CourseQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  questions: CourseQuestion[];
}

export interface LearningProgress {
  _id: string;
  aww: string | User;
  course: string | Course;
  completed: boolean;
  quizScore: number;
}

export interface PerformanceRecord {
  _id: string;
  aww: string | User;
  period: 'WEEKLY' | 'MONTHLY';
  counsellingCount: number;
  learningScore: number;
  overallScore: number;
  periodStart: string;
  periodEnd: string;
}

export interface AdminDashboardData {
  totalAWWs: number;
  totalCounselling: number;
  totalReports: number;
  performances: PerformanceRecord[];
}

export interface AWWDetailData {
  aww: User;
  counsellingCount: number;
  reports: Report[];
  performance: PerformanceRecord[];
}

