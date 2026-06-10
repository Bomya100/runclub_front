import { useState, type FormEvent, type ChangeEvent } from 'react'
import { createRunApi, type RunData } from '../services/runService'

/* ============================================================
   LogRunModal – Popup Modal to log a new run session
   ============================================================ */

interface Props {
  onClose: () => void
  onSuccess: (run: RunData) => void
}

interface FormData {
  title: string
  distance: string
  duration: string
  heartRate: string
}

export default function LogRunModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormData>({
    title: '',
    distance: '',
    duration: '',
    heartRate: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    if (!form.title.trim()) newErrors.title = 'กรุณากรอกชื่อการวิ่ง'
    if (!form.distance || isNaN(Number(form.distance)) || Number(form.distance) <= 0)
      newErrors.distance = 'กรุณากรอกระยะทาง'
    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0)
      newErrors.duration = 'กรุณากรอกระยะเวลา'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setApiError(null)
    try {
      const run = await createRunApi({
        title: form.title.trim(),
        distance: Number(form.distance),
        duration: Number(form.duration),
        ...(form.heartRate ? { heartRate: Number(form.heartRate) } : {}),
      })
      onSuccess(run)
    } catch (err) {
      setApiError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop + centering wrapper */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Modal – stop click propagation so clicking inside doesn't close */}
        <div
          className="glass-card fade-in-up"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            zIndex: 1001,
            width: '100%',
            maxWidth: '440px',
            borderRadius: '24px',
            padding: '32px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
              🏃 บันทึกการวิ่ง
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>กรอกข้อมูลการวิ่งของคุณ</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px', display: 'flex', borderRadius: '8px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* API Error */}
        {apiError && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '20px' }}>
            <span style={{ color: '#ef4444', fontSize: '15px' }}>⚠️</span>
            <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Title */}
          <ModalField
            label="ชื่อการวิ่ง"
            name="title"
            placeholder="เช่น ซ้อมวิ่งโซน 2, Long Run เช้าวันเสาร์"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />

          {/* Distance + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <ModalField
              label="ระยะทาง (กม.)"
              name="distance"
              placeholder="เช่น 10.5"
              type="number"
              value={form.distance}
              onChange={handleChange}
              error={errors.distance}
            />
            <ModalField
              label="เวลา (นาที)"
              name="duration"
              placeholder="เช่น 60"
              type="number"
              value={form.duration}
              onChange={handleChange}
              error={errors.duration}
            />
          </div>

          {/* Heart Rate (optional) */}
          <ModalField
            label="อัตราหัวใจ (bpm) — ไม่บังคับ"
            name="heartRate"
            placeholder="เช่น 145"
            type="number"
            value={form.heartRate}
            onChange={handleChange}
          />

          {/* Computed preview */}
          {form.distance && form.duration && Number(form.distance) > 0 && Number(form.duration) > 0 && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>เพซโดยประมาณ</p>
              <p className="font-display" style={{ fontSize: '22px', fontWeight: 700, color: '#f97316', margin: 0 }}>
                {computePace(Number(form.distance), Number(form.duration))} <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-text-muted)' }}>/กม.</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-secondary)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              id="log-run-submit-btn"
              className="btn-brand"
              disabled={isLoading}
              style={{ flex: 2, padding: '13px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.8 : 1 }}
            >
              {isLoading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  บันทึกการวิ่ง
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </>
  )
}

/* ── Helper ── */
function computePace(distanceKm: number, durationMin: number): string {
  const secPerKm = (durationMin * 60) / distanceKm
  const mins = Math.floor(secPerKm / 60)
  const secs = Math.round(secPerKm % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

/* ── Form Field ── */
function ModalField({
  label, name, placeholder, type = 'text', value, onChange, error,
}: {
  label: string; name: string; placeholder: string; type?: string
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; error?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-dark"
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? 'any' : undefined}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: '12px',
          fontSize: '14px',
          borderColor: error ? 'rgba(239,68,68,0.5)' : undefined,
        }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  )
}
