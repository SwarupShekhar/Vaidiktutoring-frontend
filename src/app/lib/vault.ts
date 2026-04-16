import axios from 'axios';

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
    const res = await axios.post(`${API_URL}/vault/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getAssets: async () => {
    const res = await axios.get(`${API_URL}/vault/assets`);
    return res.data;
  },

  getAsset: async (id: string) => {
    const res = await axios.get(`${API_URL}/vault/assets/${id}`);
    return res.data;
  },

  saveAnnotations: async (sessionId: string, assetId: string, annotationData: any, currentPage: number = 1, studentId?: string) => {
    const res = await axios.post(`${API_URL}/vault/annotations`, {
      session_id: sessionId,
      asset_id: assetId,
      annotation_data: annotationData,
      current_page: currentPage,
      student_id: studentId,
    });
    return res.data;
  },

  getAnnotations: async (sessionId: string, assetId: string, studentId?: string) => {
    const res = await axios.get(`${API_URL}/vault/annotations/${sessionId}/${assetId}`, {
      params: { studentId },
    });
    return res.data;
  },
};
