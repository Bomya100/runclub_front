/* ============================================================
   Auth Types
   ============================================================ */

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface UpdateDetailsRequest {
  weight: number
  height: number
  age: number
}

export interface UserData {
  _id: string
  name: string
  email: string
  weight: number
  height: number
  age: number
  avatar: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  success: boolean
  token: string
  data: UserData
}

export interface RegisterResponse {
  success: boolean
  token: string
  data: UserData
}

export interface ApiError {
  message: string
  status?: number
}

/* ============================================================
   Auth Service
   ============================================================ */

const BASE_URL = '/api/auth'

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    const error: ApiError = {
      message: data.message ?? data.detail ?? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      status: response.status,
    }
    throw error
  }

  return data as LoginResponse
}

export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    const error: ApiError = {
      message: data.message ?? data.detail ?? 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่',
      status: response.status,
    }
    throw error
  }

  return data as RegisterResponse
}

export async function updateDetailsApi(payload: UpdateDetailsRequest): Promise<{ success: boolean; data: UserData }> {
  const token = getToken()
  if (!token) throw new Error('No token found')

  const response = await fetch(`${BASE_URL}/updatedetails`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    const error: ApiError = {
      message: data.message ?? data.detail ?? 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่',
      status: response.status,
    }
    throw error
  }

  return data
}


/* ============================================================
   Token Helpers  (localStorage)
   ============================================================ */

const TOKEN_KEY = 'rc_token'
const USER_KEY  = 'rc_user'

export function saveAuth(token: string, user: UserData): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getSavedUser(): UserData | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as UserData) : null
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}
