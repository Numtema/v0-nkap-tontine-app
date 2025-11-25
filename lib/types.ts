// Nkap Application Types

export interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  country: Country
  avatar?: string
  createdAt: Date
  isVerified: boolean
  reputationScore: number
}

export interface Country {
  code: string
  name: string
  currency: string
  currencySymbol: string
  nkapRate: number // 1 Nkap = X local currency
  flag: string
}

export interface NkapWallet {
  id: string
  userId: string
  balance: number // in Nkap
  lockedBalance: number // locked in active tontines
  availableBalance: number
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "contribution" | "reception" | "fee" | "penalty"
  amount: number
  nkapAmount: number
  localAmount: number
  currency: string
  status: "pending" | "completed" | "failed"
  description: string
  createdAt: Date
  tontineId?: string
  caisseId?: string
}

export interface Tontine {
  id: string
  name: string
  slogan?: string
  description?: string
  createdBy: string
  country: Country
  contributionAmount: number // in Nkap
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly"
  membershipFee: number
  latePenaltyPercent: number
  maxMembers: number
  currentMembers: number
  status: "pending" | "active" | "completed" | "cancelled"
  caisses: Caisse[]
  members: TontineMember[]
  bureau?: Bureau
  rules: string
  createdAt: Date
  startDate?: Date
  currentCycle: number
  totalCycles: number
}

export interface TontineMember {
  userId: string
  user: User
  role: "member" | "president" | "secretary" | "treasurer" | "censor"
  joinedAt: Date
  contributionStatus: "paid" | "pending" | "late"
  drawOrder?: number
  hasReceivedPot: boolean
}

export interface Bureau {
  president: string
  secretary: string
  treasurer: string
  censors: string[]
  electedAt: Date
}

export interface Caisse {
  id: string
  name: string
  type: "main" | "epargne" | "bonheur" | "solidarite" | "custom"
  balance: number
  contributionAmount: number
  isRequired: boolean
}

export interface Message {
  id: string
  tontineId: string
  senderId: string
  sender: User
  content: string
  type: "text" | "image" | "announcement" | "system"
  createdAt: Date
  readBy: string[]
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: "CM", name: "Cameroun", currency: "XAF", currencySymbol: "FCFA", nkapRate: 100, flag: "🇨🇲" },
  { code: "SN", name: "Sénégal", currency: "XOF", currencySymbol: "FCFA", nkapRate: 100, flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", currencySymbol: "FCFA", nkapRate: 100, flag: "🇨🇮" },
  { code: "NG", name: "Nigeria", currency: "NGN", currencySymbol: "₦", nkapRate: 50, flag: "🇳🇬" },
  { code: "KE", name: "Kenya", currency: "KES", currencySymbol: "KSh", nkapRate: 10, flag: "🇰🇪" },
  { code: "GH", name: "Ghana", currency: "GHS", currencySymbol: "GH₵", nkapRate: 1, flag: "🇬🇭" },
  { code: "CD", name: "RD Congo", currency: "CDF", currencySymbol: "FC", nkapRate: 150, flag: "🇨🇩" },
  { code: "FR", name: "France", currency: "EUR", currencySymbol: "€", nkapRate: 0.15, flag: "🇫🇷" },
  { code: "US", name: "États-Unis", currency: "USD", currencySymbol: "$", nkapRate: 0.16, flag: "🇺🇸" },
]
