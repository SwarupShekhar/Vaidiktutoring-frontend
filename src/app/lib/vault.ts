import { api } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface VaultAsset {
  id: string;
  title: string;
  description?: string;
  file_type: string;
  azure_blob_name: string;
  mime_type: string;
  uploaded_by?: string;
  created_at: string;
  sasUrl?: string;
}

export const vaultApi = {
  upload: async (formData: FormData) => {
    const res = await api.post(`/vault/upload`, formData, {
      headers: { 'Content-Type': null }
    });
    return res.data;
  },

  uploadPracticeSet: async (formData: FormData) => {
    const res = await api.post(`/assessments/bulk-upload`, formData, {
      headers: { 'Content-Type': null }
    });
    return res.data;
  },

  // `studentId` lets a parent view a specific child's materials (verified server-side).
  getAssets: async (params?: { subject?: string; studentId?: string }) => {
    const res = await api.get(`/vault/assets`, { params });
    return res.data;
  },

  getAsset: async (id: string, studentId?: string) => {
    const res = await api.get(`/vault/assets/${id}`, { params: studentId ? { studentId } : undefined });
    return res.data;
  },

  // View-only: stream the bytes through our backend (authenticated, same-origin)
  // instead of fetching an Azure SAS URL directly from the browser. Avoids the
  // Azure CORS block and keeps the file un-downloadable from the Network tab.
  getAssetBlob: async (id: string, studentId?: string): Promise<Blob> => {
    const res = await api.get(`/vault/assets/${id}/stream`, {
      responseType: 'blob',
      params: studentId ? { studentId } : undefined,
    });
    return res.data as Blob;
  },

  getCurricula: async () => {
    const res = await api.get(`/curricula`);
    return res.data;
  },

  saveAnnotations: async (sessionId: string, assetId: string, annotationData: any, currentPage: number = 1, studentId?: string) => {
    const res = await api.post(`/vault/annotations`, {
      session_id: sessionId,
      asset_id: assetId,
      annotation_data: annotationData,
      current_page: currentPage,
      student_id: studentId,
    });
    return res.data;
  },

  getAnnotations: async (sessionId: string, assetId: string, studentId?: string) => {
    const res = await api.get(`/vault/annotations/${sessionId}/${assetId}`, {
      params: { studentId },
    });
    return res.data;
  },
};
