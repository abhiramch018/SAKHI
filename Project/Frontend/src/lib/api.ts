import axios, { AxiosError } from 'axios';
import {
  AuthResponse,
  User,
  Beneficiary,
  CounsellingSession,
  CounsellingEligibility,
  DecisionTreeResult,
  Report,
  BeneficiaryFeedback,
  Rule,
  Milestone,
  Course,
  LearningProgress,
  PerformanceRecord,
  AdminDashboardData,
  AWWDetailData,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

/** Gemini responses can take 20–40s; keep other API calls snappy. */
const AI_REQUEST_TIMEOUT_MS = 60000;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sakhi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        console.warn('Session expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly isNetworkError = false,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Extract a user-facing message from any API or network error. */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
        return 'AI is taking longer than usual. Please wait a moment and try again.';
      }
      return 'Unable to connect. Please try again.';
    }
    const msg = error.response.data?.message;
    if (typeof msg === 'string' && msg.length > 0) return msg;
    if (error.response.status === 401) return 'Invalid email or password.';
    if (error.response.status >= 500) return 'Server error. Please try again later.';
    return 'Something went wrong. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

async function unwrap<T>(promise: Promise<{ data: { data: T } }>): Promise<T> {
  try {
    const res = await promise;
    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && !error.response) {
      throw new ApiError(getApiErrorMessage(error), true);
    }
    throw new ApiError(getApiErrorMessage(error), false, axios.isAxiosError(error) ? error.response?.status : undefined);
  }
}

async function unwrapMessage(promise: Promise<{ data: { success: boolean; message?: string } }>): Promise<void> {
  try {
    const res = await promise;
    if (!res.data.success) {
      throw new ApiError(res.data.message || 'Request failed');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (axios.isAxiosError(error) && !error.response) {
      throw new ApiError(getApiErrorMessage(error), true);
    }
    throw new ApiError(getApiErrorMessage(error));
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    try {
      const res = await api.post<{ success: boolean; message?: string; data: AuthResponse }>(
        '/auth/login',
        data
      );
      return res.data;
    } catch (error) {
      throw new ApiError(getApiErrorMessage(error), axios.isAxiosError(error) && !error.response);
    }
  },

  register: async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (error) {
      throw new ApiError(getApiErrorMessage(error), axios.isAxiosError(error) && !error.response);
    }
  },
};

// ─── OTP ─────────────────────────────────────────────────────────────────────

export const otpApi = {
  sendOTP: async (email: string) => {
    try {
      const res = await api.post('/otp/send', { email });
      return res.data;
    } catch (error) {
      throw new ApiError(getApiErrorMessage(error), axios.isAxiosError(error) && !error.response);
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const res = await api.post('/otp/verify', { email, otp });
      return res.data;
    } catch (error) {
      throw new ApiError(getApiErrorMessage(error), axios.isAxiosError(error) && !error.response);
    }
  },
};

// ─── Beneficiaries ───────────────────────────────────────────────────────────

export const beneficiaryApi = {
  getAll: (): Promise<Beneficiary[]> =>
    unwrap(api.get('/beneficiaries')),

  getById: (id: string): Promise<Beneficiary> =>
    unwrap(api.get(`/beneficiaries/${id}`)),

  create: (data: Partial<Beneficiary>): Promise<Beneficiary> =>
    unwrap(api.post('/beneficiaries', data)),

  update: (id: string, data: Partial<Beneficiary>): Promise<Beneficiary> =>
    unwrap(api.put(`/beneficiaries/${id}`, data)),
};

// ─── Counselling ─────────────────────────────────────────────────────────────

export const counsellingApi = {
  create: (data: {
    beneficiary: string;
    aww: string;
    tier: number;
    answers: { questionId: string; answer: string }[];
  }): Promise<CounsellingSession> => unwrap(api.post('/counselling', data)),

  getByBeneficiary: (beneficiaryId: string): Promise<CounsellingSession[]> =>
    unwrap(api.get(`/counselling/beneficiary/${beneficiaryId}`)),

  getEligibility: (beneficiaryId: string): Promise<CounsellingEligibility> =>
    unwrap(api.get(`/counselling/beneficiary/${beneficiaryId}/eligibility`)),

  getById: (id: string): Promise<CounsellingSession> =>
    unwrap(api.get(`/counselling/${id}`)),

  markAttendance: (id: string): Promise<CounsellingSession> =>
    unwrap(api.patch(`/counselling/${id}/attendance`)),
};

// ─── Decision Tree ─────────────────────────────────────────────────────────────

export const decisionTreeApi = {
  evaluate: (
    tier: number,
    answers: { questionId: string; answer: string }[]
  ): Promise<DecisionTreeResult> =>
    unwrap(api.post('/decision-tree/evaluate', { tier, answers })),
};

// ─── AI ──────────────────────────────────────────────────────────────────────

export const aiApi = {
  generateGuidance: async (assessment: DecisionTreeResult, language = 'English'): Promise<string> => {
    const data = await unwrap<{ guidance: string }>(
      api.post('/ai/guidance', { assessment, language }, { timeout: AI_REQUEST_TIMEOUT_MS })
    );
    return data.guidance;
  },
};

// ─── Chat ────────────────────────────────────────────────────────────────────

export const chatApi = {
  ask: async (question: string, language = 'English'): Promise<string> => {
    const data = await unwrap<{ answer: string }>(
      api.post('/chat', { question, language }, { timeout: AI_REQUEST_TIMEOUT_MS })
    );
    return data.answer;
  },
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export const reportApi = {
  create: (data: {
    counselling: string;
    beneficiary: string;
    aww: string;
    riskLevel: string;
    actions: string[];
    aiGuidance: string;
    beneficiaryFeedback?: BeneficiaryFeedback;
  }): Promise<Report> => unwrap(api.post('/reports', data)),

  getAll: (): Promise<Report[]> => unwrap(api.get('/reports')),

  getById: (id: string): Promise<Report> => unwrap(api.get(`/reports/${id}`)),

  getByBeneficiary: (beneficiaryId: string): Promise<Report[]> =>
    unwrap(api.get(`/reports/beneficiary/${beneficiaryId}`)),
};

// ─── Rules ───────────────────────────────────────────────────────────────────

export const ruleApi = {
  getAll: (): Promise<Rule[]> => unwrap(api.get('/rules')),

  create: (data: Partial<Rule>): Promise<Rule> => unwrap(api.post('/rules', data)),

  update: (id: string, data: Partial<Rule>): Promise<Rule> =>
    unwrap(api.put(`/rules/${id}`, data)),

  delete: (id: string): Promise<void> =>
    unwrapMessage(api.delete(`/rules/${id}`)),
};

// ─── Milestones ──────────────────────────────────────────────────────────────

export interface AWWMilestoneData {
  counsellingCount: number;
  currentMilestone?: Milestone;
  allMilestones: Milestone[];
}

export const milestoneApi = {
  getAll: (): Promise<Milestone[]> => unwrap(api.get('/milestones')),

  create: (data: Partial<Milestone>): Promise<Milestone> =>
    unwrap(api.post('/milestones', data)),

  /**
   * Backend returns { counsellingCount, milestone } — normalized here
   * to include allMilestones for the frontend milestone UI.
   */
  getByAWW: async (awwId: string): Promise<AWWMilestoneData> => {
    const [awwRes, allMilestones] = await Promise.all([
      unwrap<{ counsellingCount: number; milestone?: Milestone }>(
        api.get(`/milestones/aww/${awwId}`)
      ),
      unwrap<Milestone[]>(api.get('/milestones')),
    ]);
    return {
      counsellingCount: awwRes.counsellingCount,
      currentMilestone: awwRes.milestone,
      allMilestones,
    };
  },
};

// ─── Learning ────────────────────────────────────────────────────────────────

export const learningApi = {
  getCourses: (): Promise<Course[]> => unwrap(api.get('/learning/courses')),

  getCourseById: (id: string): Promise<Course> =>
    unwrap(api.get(`/learning/courses/${id}`)),

  createCourse: (data: Partial<Course>): Promise<Course> =>
    unwrap(api.post('/learning/courses', data)),

  updateProgress: (
    awwId: string,
    courseId: string,
    data: { completed: boolean; quizScore: number }
  ): Promise<LearningProgress> =>
    unwrap(api.patch(`/learning/progress/${awwId}/${courseId}`, data)),

  getAWWProgress: (awwId: string): Promise<LearningProgress[]> =>
    unwrap(api.get(`/learning/progress/${awwId}`)),
};

// ─── Performance ─────────────────────────────────────────────────────────────

export const performanceApi = {
  getByAWW: (awwId: string): Promise<PerformanceRecord[]> =>
    unwrap(api.get(`/performance/aww/${awwId}`)),

  create: (data: {
    aww: string;
    period: string;
    counsellingCount: number;
    learningScore: number;
    overallScore: number;
    periodStart: string;
    periodEnd: string;
  }): Promise<PerformanceRecord> => unwrap(api.post('/performance', data)),
};

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: (): Promise<AdminDashboardData> =>
    unwrap(api.get('/admin/dashboard')),

  getAWWDetails: (awwId: string): Promise<AWWDetailData> =>
    unwrap(api.get(`/admin/aww/${awwId}`)),

  getAllAWWs: (): Promise<User[]> => unwrap(api.get('/awws')),
};
