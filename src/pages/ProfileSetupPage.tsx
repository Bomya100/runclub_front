import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileSetupPage() {
  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
  })
  const [errors, setErrors] = useState<{ weight?: string; height?: string; age?: string }>({})
  const { updateDetails, isLoading, error, clearError, user } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!form.weight) newErrors.weight = 'กรุณากรอกน้ำหนัก'
    if (!form.height) newErrors.height = 'กรุณากรอกส่วนสูง'
    if (!form.age) newErrors.age = 'กรุณากรอกอายุ'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    clearError()
    
    try {
      await updateDetails({
        weight: Number(form.weight),
        height: Number(form.height),
        age: Number(form.age),
      })
      navigate('/dashboard')
    } catch {
      // error handled in AuthContext
    }
  }

  return (
    <div className="bg-gradient-animated" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-card glow-orange-sm fade-in-up" style={{ width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '40px 32px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚖️</div>
          <h2 className="font-display" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            ยินดีต้อนรับ, {user?.name?.split(' ')[0] ?? 'นักวิ่ง'}!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            ขอข้อมูลเพิ่มเติมอีกนิด เพื่อให้เราคำนวณการเผาผลาญแคลอรี่และสถิติให้แม่นยำยิ่งขึ้น
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '24px' }}>
            <span style={{ color: '#ef4444' }}>⚠️</span>
            <p style={{ fontSize: '13px', color: '#ef4444', margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Weight */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                น้ำหนัก (กิโลกรัม)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="weight"
                  type="text"
                  inputMode="numeric"
                  className="input-dark"
                  placeholder="เช่น 65"
                  value={form.weight}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', paddingRight: '40px', borderRadius: '12px', borderColor: errors.weight ? 'rgba(239,68,68,0.5)' : undefined }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--color-text-muted)' }}>กก.</span>
              </div>
              {errors.weight && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{errors.weight}</p>}
            </div>

            {/* Height */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                ส่วนสูง (เซนติเมตร)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="height"
                  type="text"
                  inputMode="numeric"
                  className="input-dark"
                  placeholder="เช่น 170"
                  value={form.height}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', paddingRight: '40px', borderRadius: '12px', borderColor: errors.height ? 'rgba(239,68,68,0.5)' : undefined }}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--color-text-muted)' }}>ซม.</span>
              </div>
              {errors.height && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{errors.height}</p>}
            </div>
          </div>

          {/* Age */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              อายุ (ปี)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="age"
                type="text"
                inputMode="numeric"
                className="input-dark"
                placeholder="เช่น 25"
                value={form.age}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', paddingRight: '40px', borderRadius: '12px', borderColor: errors.age ? 'rgba(239,68,68,0.5)' : undefined }}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--color-text-muted)' }}>ปี</span>
            </div>
            {errors.age && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{errors.age}</p>}
          </div>

          <button
            type="submit"
            className="btn-brand"
            disabled={isLoading}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '15px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading ? 'กำลังบันทึก...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  )
}
