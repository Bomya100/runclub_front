export type RunType = 'easy' | 'tempo' | 'long' | 'interval' | 'race'

export interface RunSession {
  id: string
  date: string          // ISO date string
  title: string
  type: RunType
  distanceKm: number
  durationMin: number   // total minutes
  avgPaceSecPerKm: number
  avgHeartRate: number
  calories: number
  elevationM: number    // elevation gain in meters
  location: string
  notes?: string
}

export const mockRuns: RunSession[] = [
  {
    id: 'run-001',
    date: '2025-06-04T06:15:00',
    title: 'วิ่งเช้าสวนลุมพินี',
    type: 'easy',
    distanceKm: 8.5,
    durationMin: 52,
    avgPaceSecPerKm: 367,  // 6:07/km
    avgHeartRate: 142,
    calories: 612,
    elevationM: 18,
    location: 'สวนลุมพินี, กรุงเทพฯ',
  },
  {
    id: 'run-002',
    date: '2025-06-02T05:45:00',
    title: 'Tempo Run – เพิ่ม Speed',
    type: 'tempo',
    distanceKm: 6.2,
    durationMin: 33,
    avgPaceSecPerKm: 319,  // 5:19/km
    avgHeartRate: 168,
    calories: 478,
    elevationM: 12,
    location: 'รามอินทรา, กรุงเทพฯ',
    notes: 'รู้สึกดีมาก pace คงที่ตลอด',
  },
  {
    id: 'run-003',
    date: '2025-05-31T06:00:00',
    title: 'Long Run สุดสัปดาห์',
    type: 'long',
    distanceKm: 21.1,
    durationMin: 138,
    avgPaceSecPerKm: 392,  // 6:32/km
    avgHeartRate: 148,
    calories: 1580,
    elevationM: 45,
    location: 'ถนนพระราม 2, กรุงเทพฯ',
    notes: 'Half Marathon distance! เหนื่อยมากช่วง km 18-21',
  },
  {
    id: 'run-004',
    date: '2025-05-29T17:30:00',
    title: 'Interval Training',
    type: 'interval',
    distanceKm: 5.0,
    durationMin: 28,
    avgPaceSecPerKm: 336,  // 5:36/km
    avgHeartRate: 175,
    calories: 395,
    elevationM: 8,
    location: 'สนามกีฬาแห่งชาติ',
    notes: '400m x 8 reps พัก 90 วิ',
  },
  {
    id: 'run-005',
    date: '2025-05-27T06:30:00',
    title: 'Recovery Run เบาๆ',
    type: 'easy',
    distanceKm: 4.2,
    durationMin: 30,
    avgPaceSecPerKm: 428,  // 7:08/km
    avgHeartRate: 128,
    calories: 298,
    elevationM: 5,
    location: 'หมู่บ้าน, นนทบุรี',
  },
  {
    id: 'run-006',
    date: '2025-05-25T07:00:00',
    title: 'Bangkok Marathon Race Day',
    type: 'race',
    distanceKm: 42.195,
    durationMin: 258,
    avgPaceSecPerKm: 367,  // 6:07/km
    avgHeartRate: 158,
    calories: 3210,
    elevationM: 88,
    location: 'ศูนย์กีฬา Rajamangala, กรุงเทพฯ',
    notes: '🏅 Personal Best! เวลา 4:18:32',
  },
  {
    id: 'run-007',
    date: '2025-05-22T06:00:00',
    title: 'วิ่งเช้าก่อนทำงาน',
    type: 'easy',
    distanceKm: 5.5,
    durationMin: 36,
    avgPaceSecPerKm: 392,  // 6:32/km
    avgHeartRate: 138,
    calories: 402,
    elevationM: 14,
    location: 'ถนนสุขุมวิท, กรุงเทพฯ',
  },
  {
    id: 'run-008',
    date: '2025-05-20T18:00:00',
    title: 'Tempo 8km',
    type: 'tempo',
    distanceKm: 8.0,
    durationMin: 42,
    avgPaceSecPerKm: 315,  // 5:15/km
    avgHeartRate: 170,
    calories: 612,
    elevationM: 22,
    location: 'สวนหลวง ร.9',
    notes: 'ทดสอบ shoe ใหม่',
  },
  {
    id: 'run-009',
    date: '2025-05-18T06:15:00',
    title: 'Long Run 15km',
    type: 'long',
    distanceKm: 15.0,
    durationMin: 98,
    avgPaceSecPerKm: 392,  // 6:32/km
    avgHeartRate: 150,
    calories: 1105,
    elevationM: 32,
    location: 'เกาะรัตนโกสินทร์',
  },
  {
    id: 'run-010',
    date: '2025-05-16T07:00:00',
    title: 'Easy Run + Strides',
    type: 'easy',
    distanceKm: 7.0,
    durationMin: 46,
    avgPaceSecPerKm: 394,  // 6:34/km
    avgHeartRate: 140,
    calories: 515,
    elevationM: 16,
    location: 'สวนเบญจกิติ',
    notes: 'ช่วงท้ายทำ 4x100m strides',
  },
]

/** Convert avgPaceSecPerKm → "M:SS" string */
export function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60)
  const s = secPerKm % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Convert totalMinutes → "HH:MM:SS" or "MM:SS" string */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:00`
  return `${m}:00`
}

export const RUN_TYPE_CONFIG: Record<RunType, { label: string; color: string; bg: string; icon: string }> = {
  easy:     { label: 'Easy Run',  color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '🟢' },
  tempo:    { label: 'Tempo',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '🟡' },
  long:     { label: 'Long Run',  color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: '🟣' },
  interval: { label: 'Interval',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '🔴' },
  race:     { label: 'Race',      color: '#f97316', bg: 'rgba(249,115,22,0.15)',  icon: '🏆' },
}
