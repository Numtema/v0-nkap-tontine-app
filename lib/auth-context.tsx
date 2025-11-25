"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Country, NkapWallet } from "./types"
import { SUPPORTED_COUNTRIES } from "./types"

interface AuthContextType {
  user: User | null
  wallet: NkapWallet | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (phone: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  verifyOtp: (otp: string) => Promise<boolean>
  updateUser: (data: Partial<User>) => void
}

interface SignupData {
  firstName: string
  lastName: string
  phone: string
  email?: string
  password: string
  country: Country
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demo purposes
const MOCK_USER: User = {
  id: "user-1",
  firstName: "Marie",
  lastName: "Nguema",
  phone: "+237 691 234 567",
  email: "marie@example.com",
  country: SUPPORTED_COUNTRIES[0],
  isVerified: true,
  reputationScore: 4.8,
  createdAt: new Date("2024-01-15"),
}

const MOCK_WALLET: NkapWallet = {
  id: "wallet-1",
  userId: "user-1",
  balance: 15000,
  lockedBalance: 5000,
  availableBalance: 10000,
  transactions: [],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [wallet, setWallet] = useState<NkapWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("nkap_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setWallet(MOCK_WALLET)
    }
    setIsLoading(false)
  }, [])

  const login = async (phone: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, accept any credentials
    setUser(MOCK_USER)
    setWallet(MOCK_WALLET)
    localStorage.setItem("nkap_user", JSON.stringify(MOCK_USER))
    setIsLoading(false)
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      country: data.country,
      isVerified: false,
      reputationScore: 0,
      createdAt: new Date(),
    }

    setPendingPhone(data.phone)
    setIsLoading(false)
  }

  const verifyOtp = async (otp: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    // For demo, accept "123456" as valid OTP
    if (otp === "123456") {
      setUser({ ...MOCK_USER, isVerified: true })
      setWallet(MOCK_WALLET)
      localStorage.setItem("nkap_user", JSON.stringify(MOCK_USER))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setWallet(null)
    localStorage.removeItem("nkap_user")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data }
      setUser(updated)
      localStorage.setItem("nkap_user", JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        verifyOtp,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
