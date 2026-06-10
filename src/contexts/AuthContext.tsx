import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  loginApi,
  registerApi,
  saveAuth,
  clearAuth,
  getSavedUser,
  getToken,
  updateDetailsApi,
  type UserData,
  type LoginRequest,
  type RegisterRequest,
  type UpdateDetailsRequest,
  type ApiError,
} from '../services/authService'

/* ============================================================
   Auth Context
   ============================================================ */

interface AuthContextValue {
  user: UserData | null
  token: string | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (payload: RegisterRequest) => Promise<void>
  updateDetails: (payload: UpdateDetailsRequest) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/* ============================================================
   Auth Provider
   ============================================================ */

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage so refresh doesn't log out
  const [user, setUser]   = useState<UserData | null>(getSavedUser)
  const [token, setToken] = useState<string | null>(getToken)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await loginApi(credentials)
      saveAuth(res.token, res.data)
      setToken(res.token)
      setUser(res.data)
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (payload: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await registerApi(payload)
      saveAuth(res.token, res.data)
      setToken(res.token)
      setUser(res.data)
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateDetails = useCallback(async (payload: UpdateDetailsRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await updateDetailsApi(payload)
      // Only update user data, token remains the same
      if (token) {
        saveAuth(token, res.data)
      }
      setUser(res.data)
    } catch (err) {
      const apiErr = err as ApiError
      setError(apiErr.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(token && user),
        isLoading,
        error,
        login,
        register,
        updateDetails,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ============================================================
   useAuth hook
   ============================================================ */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
