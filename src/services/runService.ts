import { getToken } from './authService'

/* ============================================================
   Run Types
   ============================================================ */

export interface CreateRunRequest {
  title: string
  distance: number
  duration: number
  heartRate?: number
}

export interface RunData {
  _id: string
  title: string
  distance: number
  duration: number
  heartRate?: number
  pace: string
  date: string
  user: string
  createdAt: string
  updatedAt: string
}

export interface RunsResponse {
  success: boolean
  data: RunData[]
}

/* ============================================================
   Run Service
   ============================================================ */

const BASE_URL = '/api/runs'

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function createRunApi(payload: CreateRunRequest): Promise<RunData> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'ไม่สามารถบันทึกการวิ่งได้ กรุณาลองใหม่')
  }

  return data.data as RunData
}

export async function getRunsApi(): Promise<RunData[]> {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: authHeaders(),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'ไม่สามารถโหลดประวัติการวิ่งได้')
  }

  return data.data as RunData[]
}
