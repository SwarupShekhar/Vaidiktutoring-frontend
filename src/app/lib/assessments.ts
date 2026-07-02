import { api } from './api';

export interface AssessmentQuestion {
  id: string;
  curriculum_id: string;
  grade: string;
  question_type: string;
  content: {
    question_text: string;
    options: string[];
    passage?: string;
    explanation?: string;
  };
  correct_answer?: string;
  metadata?: any;
}

export const assessmentsApi = {
  getPersonalizedQuestions: async (userId: string, limit: number = 20, curriculum_id?: string, grade?: string) => {
    const params: any = { user_id: userId, limit };
    if (curriculum_id) params.curriculum_id = curriculum_id;
    if (grade) params.grade = grade;
    
    const res = await api.get(`/assessments/personalized`, { params });
    return res.data as AssessmentQuestion[];
  }
};
