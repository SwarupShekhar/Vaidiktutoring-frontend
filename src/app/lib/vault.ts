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

  saveAnnotations: async (data: {
    session_id: string;
    asset_id: string;
    student_id?: string;
    annotation_data: any;
    current_page: number;
  }) => {
    const res = await axios.post(`${API_URL}/vault/annotations`, data);
    return res.data;
  },

  getAnnotations: async (sessionId: string, assetId: string, studentId?: string) => {
    const res = await axios.get(`${API_URL}/vault/annotations/${sessionId}/${assetId}`, {
      params: { studentId },
    });
    return res.data;
  },
};
