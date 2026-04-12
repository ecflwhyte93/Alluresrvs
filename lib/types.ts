export interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  age: number | null
  location: string | null
  avatar_url: string | null
  is_verified: boolean
  subscription_tier: string
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string | null
  images: string[]
  location: string | null
  category: string | null
  is_featured: boolean
  is_active: boolean
  expires_at: string | null
  views: number
  created_at: string
  profiles?: Profile
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_type: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
}
