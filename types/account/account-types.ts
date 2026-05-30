export type Account = {
  id: string
  userId: string
  name: string
  currentBalance: number
  currency: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type Account_Response = {
  id: string
  user_id: string
  name: string
  current_balance: number
  currency: string
  is_archived: boolean
  created_at: string
  updated_at: string
}
