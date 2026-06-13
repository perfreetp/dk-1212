export interface Personality {
  id: string
  name: string
  avatar: string
  description: string
  purpose: string
  tone: string
  domain: string
  price: number
  unit: 'hour' | 'day' | 'month' | 'year'
  creatorId: string
  creatorName: string
  creatorAvatar: string
  favorites: number
  sales: number
  rating: number
  reviews: Review[]
  sampleDialogs: Dialog[]
  disabledTopics: string[]
  greeting: string
  visibility: 'public' | 'private' | 'limited'
  status: 'online' | 'offline' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  content: string
  images?: string[]
  createdAt: string
  reply?: Reply
}

export interface Reply {
  content: string
  createdAt: string
}

export interface Dialog {
  id: string
  userMessage: string
  aiMessage: string
}

export interface User {
  id: string
  name: string
  avatar: string
  balance: number
  phone: string
  email: string
  role: 'user' | 'creator' | 'admin'
}

export interface Purchase {
  id: string
  personalityId: string
  personalityName: string
  personalityAvatar: string
  price: number
  duration: number
  durationUnit: 'hour' | 'day' | 'month' | 'year'
  expiresAt: string
  status: 'active' | 'expired'
  purchasedAt: string
}

export interface Favorite {
  id: string
  personalityId: string
  personalityName: string
  personalityAvatar: string
  favoritedAt: string
}

export interface CreatorStats {
  personalityCount: number
  totalSales: number
  totalRevenue: number
  avgRating: number
  todayViews: number
  todaySales: number
}

export interface RevenueRecord {
  id: string
  amount: number
  description: string
  createdAt: string
  type: 'sale' | 'refund' | 'withdrawal'
}