export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  is_redaksi: boolean;
  is_admin: boolean;
  created_at?: string;
}

export interface Article {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: 'draft' | 'pending' | 'revision' | 'published' | 'archived';
  isPremium: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  content: string;
  createdAt?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  durationDays: number;
  price: number;
  description?: string;
  isActive: boolean;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  reference_type?: string;
  reference_id?: number;
  is_read: boolean;
  created_at?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
