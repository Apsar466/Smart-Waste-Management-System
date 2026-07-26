import axiosInstance from './axios';
import type {
  ApiResponse, AuthData, LoginRequest, RegisterRequest,
  WasteReport, PickupRequest, CreatePickupRequest,
  Complaint, ChatMessage, SendMessageRequest,
  Reward, Notification, AdminStats, User
} from '@/types';

// ─── Public (no auth required) ───────────────────────────────────────────────
export const publicApi = {
  /** Platform-wide statistics for landing page hero section */
  getStats: () =>
    axiosInstance.get<ApiResponse<Record<string, string | number>>>('/public/stats'),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post<ApiResponse<AuthData>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    axiosInstance.post<ApiResponse<User>>('/auth/register', data),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post<ApiResponse<AuthData>>('/auth/refresh', null, { params: { refreshToken } }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosInstance.post<ApiResponse<null>>('/auth/change-password', data),
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const userApi = {
  getProfile: () =>
    axiosInstance.get<ApiResponse<User>>('/users/profile'),

  updateProfile: (data: Partial<User>) =>
    axiosInstance.put<ApiResponse<User>>('/users/profile', data),
};

// ─── Waste Analysis ───────────────────────────────────────────────────────────
export const wasteApi = {
  analyze: (formData: FormData) =>
    axiosInstance.post<ApiResponse<WasteReport>>('/waste/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getHistory: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<{ content: WasteReport[]; totalElements: number }>>('/waste/history', {
      params: { page, size },
    }),

  getReport: (id: number) =>
    axiosInstance.get<ApiResponse<WasteReport>>(`/waste/${id}`),
};

// ─── Pickup ───────────────────────────────────────────────────────────────────
export const pickupApi = {
  create: (data: CreatePickupRequest) =>
    axiosInstance.post<ApiResponse<PickupRequest>>('/pickup/request', data),

  getHistory: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<{ content: PickupRequest[]; totalElements: number }>>('/pickup/history', {
      params: { page, size },
    }),

  cancel: (id: number) =>
    axiosInstance.put<ApiResponse<PickupRequest>>(`/pickup/cancel/${id}`),
};

// ─── Complaints ───────────────────────────────────────────────────────────────
export const complaintApi = {
  report: (formData: FormData) =>
    axiosInstance.post<ApiResponse<Complaint>>('/complaints/report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getHistory: (page = 0, size = 10) =>
    axiosInstance.get<ApiResponse<{ content: Complaint[]; totalElements: number }>>('/complaints/history', {
      params: { page, size },
    }),
};

// ─── AI Chat ──────────────────────────────────────────────────────────────────
export const chatApi = {
  sendMessage: (data: SendMessageRequest) =>
    axiosInstance.post<ApiResponse<ChatMessage>>('/ai/chat', data),

  getHistory: (page = 0, size = 20) =>
    axiosInstance.get<ApiResponse<{ content: ChatMessage[]; totalElements: number }>>('/ai/history', {
      params: { page, size },
    }),
};

// ─── Rewards ──────────────────────────────────────────────────────────────────
export const rewardApi = {
  getRewards: () =>
    axiosInstance.get<ApiResponse<Reward>>('/rewards'),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationApi = {
  getNotifications: () =>
    axiosInstance.get<ApiResponse<Notification[]>>('/notifications'),

  markRead: (id: number) =>
    axiosInstance.put<ApiResponse<null>>(`/notifications/${id}/read`),

  markAllRead: () =>
    axiosInstance.post<ApiResponse<null>>('/notifications/read'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () =>
    axiosInstance.get<ApiResponse<any>>('/admin/dashboard'),

  getUsers: (page = 0, size = 20) =>
    axiosInstance.get<ApiResponse<any[]>>('/admin/users'),

  updateUserStatus: (id: number, status: string) =>
    axiosInstance.put<ApiResponse<any>>(`/admin/users/${id}/status`, null, { params: { status } }),

  deleteUser: (id: number) =>
    axiosInstance.delete<ApiResponse<any>>(`/admin/users/${id}`),

  getReports: (page = 0, size = 20) =>
    axiosInstance.get<ApiResponse<any[]>>('/admin/reports'),

  getReportsWithFilter: (type: string, startDate?: string, endDate?: string) =>
    axiosInstance.get<ApiResponse<any[]>>('/admin/reports', { params: { type, startDate, endDate } }),

  getComplaints: (page = 0, size = 20) =>
    axiosInstance.get<ApiResponse<any[]>>('/admin/complaints'),

  updateComplaintStatus: (id: number, status: string, comment?: string) =>
    axiosInstance.put<ApiResponse<any>>(`/admin/complaints/${id}/status`, null, {
      params: { status, comment },
    }),

  getPickups: () =>
    axiosInstance.get<ApiResponse<any[]>>('/admin/pickups'),

  updatePickupStatus: (id: number, status: string, driver?: string, remarks?: string) =>
    axiosInstance.put<ApiResponse<any>>(`/admin/pickups/${id}/status`, null, {
      params: { status, driver, remarks },
    }),

  getAnalytics: () =>
    axiosInstance.get<ApiResponse<any>>('/admin/analytics'),

  getCacheStatistics: () =>
    axiosInstance.get<ApiResponse<any>>('/admin/cache/statistics'),

  broadcastNotification: (title: string, message: string) =>
    axiosInstance.post<ApiResponse<any>>('/admin/notifications', null, { params: { title, message } }),
};
