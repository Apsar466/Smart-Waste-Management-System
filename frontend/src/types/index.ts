// TypeScript interfaces for all API types

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  language?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface WasteReport {
  id: number;
  imageUrl: string;
  wasteCategory: string;
  aiAnalysis: string;
  confidence: number;
  recyclable: boolean;
  disposalMethod: string;
  environmentalImpact: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  language: string;
  status: string;
  createdAt: string;
  source?: 'CACHE' | 'GEMINI'; // Cache provenance badge
}

export interface WasteAnalysisResult {
  wasteCategory: string;
  confidence: number;
  recyclable: boolean;
  disposalMethod: string;
  environmentalImpact: string;
  detailedExplanation: string;
  safetyWarnings?: string;
}

export interface PickupRequest {
  id: number;
  scheduledDate: string;
  location: string;
  wasteType: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedTime?: string;
  createdAt: string;
}

export interface CreatePickupRequest {
  scheduledDate: string;
  location: string;
  wasteType: string;
  notes?: string;
}

export interface Complaint {
  id: number;
  imageUrl?: string;
  location: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  aiAnalysis?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  question: string;
  answer: string;
  language: string;
  createdAt: string;
  source?: 'CACHE' | 'GEMINI'; // Cache provenance badge
}

export interface SendMessageRequest {
  question: string;
  language: string;
}

export interface Reward {
  id: number;
  totalPoints: number;
  badges: string[];
  reportsCount: number;
  pickupsCount: number;
  complaintsCount: number;
  level: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalReports: number;
  totalPickups: number;
  totalComplaints: number;
  pendingPickups: number;
  resolvedComplaints: number;
  totalCarbonSaved: number;
}
