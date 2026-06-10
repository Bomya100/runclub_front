import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../contexts/AuthContext'
import {
  mockRuns,
  formatPace,
  formatDuration,
  RUN_TYPE_CONFIG,
  type RunSession,
  type RunType,
} from '../data/mockRuns'

/* ============================================================
   Dashboard – Run History Page (Main)
   ============================================================ */

const FILTER_TYPES: { value: 'all' | RunType; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'easy', label: 'Easy Run' },
  { value: 'tempo', label: 'Tempo' },
  { value: 'long', label: 'Long Run' },
  { value: 'interval', label: 'Interval' },
  { value: 'race', label: 'Race' },
]

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | RunType>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { user } = useAuth()

  const filtered = filter === 'all' ? mockRuns : mockRuns.filter((r) => r.type === filter)

  /* ── Summary stats (all time) ── */
  const totalKm = mockRuns.reduce((s, r) => s + r.distanceKm, 0)
  const totalRuns = mockRuns.length
  const totalMin = mockRuns.reduce((s, r) => s + r.durationMin, 0)
  const avgPace = Math.round(mockRuns.reduce((s, r) => s + r.avgPaceSecPerKm, 0) / totalRuns)
  const totalCal = mockRuns.reduce((s, r) => s + r.calories, 0)

  return (
    <DashboardLayout>
      <div
        style={{
          padding: '32px 32px 48px',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* ── Page Header ── */}
        <div className="fade-in-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-brand-orange)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ยินดีต้อนรับกลับ 👋
            </p>
            <h1 className="font-display" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              {user?.name ?? 'นักวิ่ง'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              ประวัติการวิ่งล่าสุดของคุณ
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="pulse-dot" />
              <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 500 }}>ออนไลน์</span>
            </div>
          </div>
        </div>

        {/* ── Summary Stats Cards ── */}
        <div
          className="fade-in-up fade-in-up-delay-1"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}
          id="stats-grid"
        >
          <StatCard
            icon="🏃"
            label="ระยะทางรวม"
            value={`${totalKm.toFixed(1)}`}
            unit="กม."
            color="#f97316"
            subtext={`จาก ${totalRuns} ครั้ง`}
          />
          <StatCard
            icon="⏱️"
            label="เวลาวิ่งรวม"
            value={`${Math.floor(totalMin / 60)}:${String(totalMin % 60).padStart(2, '0')}`}
            unit="ชม."
            color="#6366f1"
            subtext="ชั่วโมง : นาที"
          />
          <StatCard
            icon="⚡"
            label="เพซเฉลี่ย"
            value={formatPace(avgPace)}
            unit="/กม."
            color="#f59e0b"
            subtext="นาที/กิโลเมตร"
          />
          <StatCard
            icon="🔥"
            label="แคลอรี่รวม"
            value={totalCal.toLocaleString()}
            unit="kcal"
            color="#ef4444"
            subtext="พลังงานที่เผาผลาญ"
          />
        </div>

        {/* ── Run History Section ── */}
        <div className="fade-in-up fade-in-up-delay-2">
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              10 ครั้งล่าสุด
            </h2>
            {/* Filter chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {FILTER_TYPES.map((f) => (
                <button
                  key={f.value}
                  id={`filter-${f.value}`}
                  onClick={() => setFilter(f.value)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '99px',
                    border: filter === f.value ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    background: filter === f.value ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
                    color: filter === f.value ? '#f97316' : 'var(--color-text-secondary)',
                    fontSize: '12px',
                    fontWeight: filter === f.value ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Run Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                ไม่มีข้อมูลการวิ่งประเภทนี้
              </div>
            )}
            {filtered.map((run, idx) => (
              <RunCard
                key={run.id}
                run={run}
                index={idx}
                isExpanded={expandedId === run.id}
                onToggle={() => setExpandedId(expandedId === run.id ? null : run.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (min-width: 640px) {
          #stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 480px) {
          #stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  )
}

/* ────────────────────────────────────────────────────────────
   Run Card
   ──────────────────────────────────────────────────────────── */
function RunCard({
  run,
  index,
  isExpanded,
  onToggle,
}: {
  run: RunSession
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const cfg = RUN_TYPE_CONFIG[run.type]
  const date = new Date(run.date)
  const dateStr = date.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })
  const timeStr = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      id={`run-card-${run.id}`}
      className="glass-card"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        animationDelay: `${index * 0.05}s`,
        cursor: 'pointer',
        border: isExpanded ? '1px solid rgba(249,115,22,0.25)' : '1px solid rgba(255,255,255,0.06)',
      }}
      onClick={onToggle}
      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* ── Main Row ── */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Run type icon */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: cfg.bg,
            border: `1px solid ${cfg.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
          }}
        >
          {run.type === 'race' ? '🏆' : run.type === 'interval' ? '⚡' : run.type === 'tempo' ? '🔥' : run.type === 'long' ? '🗺️' : '🏃'}
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span className="font-display" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {run.title}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '99px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: cfg.color,
                background: cfg.bg,
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {cfg.label}
            </span>
            {run.type === 'race' && (
              <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, color: '#f97316', background: 'rgba(249,115,22,0.12)', letterSpacing: '0.04em' }}>
                🏅 PB
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {dateStr}
            <span style={{ opacity: 0.4 }}>·</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {timeStr}
            <span style={{ opacity: 0.4 }}>·</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
              {run.location}
            </span>
          </div>
        </div>

        {/* Key metrics */}
        <div style={{ display: 'flex', gap: '20px', flexShrink: 0, alignItems: 'center' }} id="run-metrics">
          <Metric label="ระยะทาง" value={run.distanceKm.toFixed(1)} unit="กม." highlight />
          <Metric label="เพซ" value={formatPace(run.avgPaceSecPerKm)} unit="/กม." />
          <Metric label="เวลา" value={formatDuration(run.durationMin)} unit="" />
        </div>

        {/* Expand chevron */}
        <div
          style={{
            color: 'var(--color-text-muted)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ── Expanded Detail ── */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Extra stats */}
          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: run.notes ? '16px' : 0,
            }}
            id="detail-stats-grid"
          >
            {[
              { icon: '❤️', label: 'อัตราหัวใจเฉลี่ย', value: `${run.avgHeartRate} bpm`, color: '#ef4444' },
              { icon: '🔥', label: 'แคลอรี่', value: `${run.calories.toLocaleString()} kcal`, color: '#f97316' },
              { icon: '⛰️', label: 'ความสูงสะสม', value: `${run.elevationM} ม.`, color: '#6366f1' },
              { icon: '📏', label: 'ระยะทาง', value: `${run.distanceKm.toFixed(2)} กม.`, color: '#22c55e' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '1px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {run.notes && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(249,115,22,0.06)',
                border: '1px solid rgba(249,115,22,0.15)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>📝</span>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {run.notes}
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          #run-metrics { display: none !important; }
        }
        #detail-stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 640px) {
          #detail-stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────────────────────── */

function StatCard({
  icon, label, value, unit, color, subtext,
}: {
  icon: string; label: string; value: string; unit: string; color: string; subtext?: string
}) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '18px',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '22px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
        <span className="font-display" style={{ fontSize: '24px', fontWeight: 800, color }}>
          {value}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '2px' }}>{label}</div>
      {subtext && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{subtext}</div>}
    </div>
  )
}

function Metric({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div
        className="font-display"
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color: highlight ? '#f97316' : 'var(--color-text-primary)',
          lineHeight: 1,
        }}
      >
        {value}
        {unit && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '2px' }}>{unit}</span>}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  )
}
