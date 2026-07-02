import { api } from './api';

export interface Assignment {
    id: string;
    title: string;
    description?: string;
    curriculum_id?: string;
    grade?: string;
    asset_id?: string;
    due_date?: string;
    created_by?: string;
    created_at: string;
    vault_assets?: {
        id: string;
        title: string;
        azure_blob_name: string;
        file_type: string;
        sasUrl?: string;
    };
    submissions?: Submission[];
}

export interface Submission {
    id: string;
    assignment_id: string;
    student_id: string;
    azure_blob_name: string;
    sasUrl?: string;
    score?: number;
    feedback?: string;
    submitted_at?: string;
    graded_at?: string;
}

export const assignmentsApi = {
    async createAssignment(data: {
        title: string;
        description?: string;
        curriculum_id: string;
        grade: string;
        asset_id: string;
        due_date?: string;
    }) {
        const res = await api.post(`/assignments`, data);
        return res.data;
    },

    async getAssignments(params?: { curriculum_id?: string; grade?: string; user_id?: string }) {
        const res = await api.get(`/assignments`, { params });
        return res.data as Assignment[];
    },

    async submitAssignment(assignmentId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await api.post(`/assignments/${assignmentId}/submit`, formData, {
            headers: { 'Content-Type': undefined }
        });
        return res.data;
    },

    async gradeAssignment(submissionId: string, score: number, feedback: string) {
        const res = await api.patch(`/assignments/submissions/${submissionId}/grade`, { score, feedback });
        return res.data;
    }
};
