import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/* ============================================================
   RunClub – Register Page
   Dark Mode / Orange-Red Brand / Glassmorphism
   ============================================================ */

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  agreeTerms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  agreeTerms?: string
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuth()

  /* ── Validation ── */
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'กรุณากรอกชื่อ'
    if (!form.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }
    if (form.phone && !/^[0-9]{9,10}$/.test(form.phone.replace(/-/g, ''))) {
      newErrors.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน'
    } else if (form.password.length < 8) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    }
    if (!form.agreeTerms) {
      newErrors.agreeTerms = 'กรุณายอมรับข้อกำหนดและเงื่อนไข'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleNext = (e: FormEvent) => {
    e.preventDefault()
    if (validateStep1()) setStep(2)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return
    clearError()
    try {
      await register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      })
      navigate('/dashboard')
    } catch {
      // error is set in AuthContext
    }
  }

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div
      className="bg-gradient-animated"
      style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Ambient Orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ══════════════════════════════════════════════
          LEFT PANEL – Brand / Hero
          ══════════════════════════════════════════════ */}
      <div
        id="left-panel"
        style={{
          display: 'none',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Floating benefit cards */}
        <BenefitCard
          style={{ position: 'absolute', top: '18%', right: '6%', animationDelay: '0s' }}
          icon="🎯"
          title="ตั้งเป้าหมาย"
          desc="กำหนด pace & ระยะทางเอง"
        />
        <BenefitCard
          style={{ position: 'absolute', bottom: '22%', right: '8%', animationDelay: '-3s' }}
          icon="📈"
          title="ติดตามพัฒนาการ"
          desc="กราฟสถิติรายสัปดาห์"
        />

        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <LogoMark size="lg" />
        </div>

        {/* Headline */}
        <h1
          className="font-display gradient-text-brand"
          style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}
        >
          เริ่มต้นการวิ่ง
          <br />
          ที่ดีกว่าเดิม
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary)',
            maxWidth: '360px',
            lineHeight: 1.75,
            marginBottom: '40px',
          }}
        >
          สมัครสมาชิกฟรี ไม่มีค่าใช้จ่าย เข้าร่วมชุมชนนักวิ่งกว่า
          12,000 คนทั่วประเทศไทย
        </p>

        {/* Steps preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { n: '1', title: 'สร้างโปรไฟล์', desc: 'ใส่ข้อมูลพื้นฐานของคุณ' },
            { n: '2', title: 'ตั้งรหัสผ่าน', desc: 'ปลอดภัยด้วยรหัสผ่านที่แข็งแกร่ง' },
            { n: '3', title: 'เริ่มวิ่ง!', desc: 'เข้าร่วมกิจกรรมและติดตามสถิติ' },
          ].map((item, idx) => (
            <StepItem
              key={item.n}
              number={item.n}
              title={item.title}
              desc={item.desc}
              isActive={idx + 1 === step}
              isDone={idx + 1 < step}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT PANEL – Register Form
          ══════════════════════════════════════════════ */}
      <div
        id="right-panel"
        style={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ width: '100%', maxWidth: '460px' }}>
          {/* Mobile logo */}
          <div
            id="mobile-logo"
            className="fade-in-up"
            style={{ textAlign: 'center', marginBottom: '28px' }}
          >
            <LogoMark size="sm" />
          </div>

          {/* Step Indicator (mobile) */}
          <div
            className="fade-in-up fade-in-up-delay-1"
            style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}
          >
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  height: '4px',
                  flex: 1,
                  maxWidth: '80px',
                  borderRadius: '99px',
                  background:
                    s <= step
                      ? 'linear-gradient(90deg, #f97316, #ef4444)'
                      : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* Register Card */}
          <div
            className="glass-card glow-orange-sm fade-in-up fade-in-up-delay-2"
            style={{ borderRadius: '24px', padding: '36px 32px' }}
          >
            {/* Card Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2
                    className="font-display"
                    style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}
                  >
                    {step === 1 ? 'สร้างบัญชีใหม่ 🏃' : 'ตั้งรหัสผ่าน 🔐'}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {step === 1
                      ? 'กรอกข้อมูลพื้นฐานเพื่อเริ่มต้น'
                      : 'สร้างรหัสผ่านที่ปลอดภัยสำหรับบัญชีของคุณ'}
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(249,115,22,0.12)',
                    border: '1px solid rgba(249,115,22,0.25)',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: 'var(--color-brand-orange)',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                  }}
                >
                  {step} / 2
                </div>
              </div>
            </div>

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name */}
                <FormField
                  id="name-input"
                  name="name"
                  label="ชื่อ"
                  placeholder="สมชาย ใจดี"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                />

                {/* Email */}
                <FormField
                  id="email-input"
                  name="email"
                  label="อีเมล"
                  type="email"
                  placeholder="runner@runclub.th"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                />

                {/* Phone (optional) */}
                <FormField
                  id="phone-input"
                  name="phone"
                  label="เบอร์โทรศัพท์"
                  type="tel"
                  placeholder="08X-XXX-XXXX (ไม่บังคับ)"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.4a16 16 0 0 0 6.29 6.29l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                />

                {/* Next Button */}
                <button
                  type="submit"
                  id="register-next-btn"
                  className="btn-brand"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '15px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>ถัดไป</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}

            {/* ── STEP 2: Password ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* ── Error Banner ── */}
                {error && (
                  <div
                    id="register-error-banner"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.3)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ fontSize: '13px', color: '#ef4444', margin: 0, lineHeight: 1.5 }}>{error}</p>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label
                    htmlFor="password-input"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}
                  >
                    รหัสผ่าน
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <input
                      id="password-input"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="input-dark"
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      value={form.password}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        paddingLeft: '42px',
                        paddingRight: '46px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        borderColor: errors.password ? 'rgba(239,68,68,0.5)' : undefined,
                      }}
                    />
                    <button
                      type="button"
                      id="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                    >
                      {showPassword
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {form.password && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            style={{
                              flex: 1,
                              height: '3px',
                              borderRadius: '99px',
                              background:
                                lvl <= passwordStrength.score
                                  ? passwordStrength.color
                                  : 'rgba(255,255,255,0.08)',
                              transition: 'background 0.3s ease',
                            }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: '11px', color: passwordStrength.color, fontWeight: 500 }}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.password && <ErrorText text={errors.password} />}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password-input"
                    style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}
                  >
                    ยืนยันรหัสผ่าน
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <input
                      id="confirm-password-input"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      className="input-dark"
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        paddingLeft: '42px',
                        paddingRight: '46px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        borderColor: errors.confirmPassword
                          ? 'rgba(239,68,68,0.5)'
                          : form.confirmPassword && form.password === form.confirmPassword
                          ? 'rgba(34,197,94,0.5)'
                          : undefined,
                      }}
                    />
                    {/* Match indicator */}
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#22c55e' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    {!form.confirmPassword || form.password !== form.confirmPassword ? (
                      <button
                        type="button"
                        id="toggle-confirm-btn"
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                      >
                        {showConfirm
                          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    ) : null}
                  </div>
                  {errors.confirmPassword && <ErrorText text={errors.confirmPassword} />}
                </div>

                {/* Password Requirements */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                  }}
                >
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ข้อกำหนดรหัสผ่าน
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {[
                      { test: form.password.length >= 8, label: 'อย่างน้อย 8 ตัว' },
                      { test: /[A-Z]/.test(form.password), label: 'ตัวพิมพ์ใหญ่ (A-Z)' },
                      { test: /[0-9]/.test(form.password), label: 'ตัวเลข (0-9)' },
                      { test: /[^A-Za-z0-9]/.test(form.password), label: 'อักขระพิเศษ (!@#)' },
                    ].map((req) => (
                      <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ color: req.test ? '#22c55e' : 'var(--color-text-muted)', flexShrink: 0 }}>
                          {req.test
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9"/></svg>
                          }
                        </div>
                        <span style={{ fontSize: '11px', color: req.test ? 'var(--color-text-secondary)' : 'var(--color-text-muted)', transition: 'color 0.2s' }}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms checkbox */}
                <div>
                  <label
                    htmlFor="agree-terms-checkbox"
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}
                  >
                    <div style={{ position: 'relative', width: '18px', height: '18px', flexShrink: 0, marginTop: '1px' }}>
                      <input
                        type="checkbox"
                        id="agree-terms-checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                        style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', margin: 0 }}
                      />
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '5px',
                          border: form.agreeTerms
                            ? '2px solid #f97316'
                            : errors.agreeTerms
                            ? '2px solid rgba(239,68,68,0.6)'
                            : '2px solid rgba(255,255,255,0.15)',
                          background: form.agreeTerms ? 'linear-gradient(135deg, #f97316, #ef4444)' : 'rgba(10,10,15,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          pointerEvents: 'none',
                        }}
                      >
                        {form.agreeTerms && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, userSelect: 'none' }}>
                      ฉันยอมรับ{' '}
                      <a href="#" style={{ color: 'var(--color-brand-orange)', textDecoration: 'none' }}>ข้อกำหนดการใช้งาน</a>
                      {' '}และ{' '}
                      <a href="#" style={{ color: 'var(--color-brand-orange)', textDecoration: 'none' }}>นโยบายความเป็นส่วนตัว</a>
                      {' '}ของ RunClub
                    </span>
                  </label>
                  {errors.agreeTerms && <ErrorText text={errors.agreeTerms} />}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    id="register-back-btn"
                    onClick={() => { setStep(1); setErrors({}) }}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--color-text-secondary)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    ย้อนกลับ
                  </button>

                  <button
                    type="submit"
                    id="register-submit-btn"
                    className="btn-brand"
                    disabled={isLoading}
                    style={{
                      flex: 1,
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
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        <span>กำลังสมัคร...</span>
                      </>
                    ) : (
                      <>
                        <span>สมัครสมาชิก</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Divider + Login link */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div className="divider-with-text" style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  มีบัญชีอยู่แล้ว?
                </span>
              </div>
              <Link
                to="/login"
                id="goto-login-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '11px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(249,115,22,0.25)',
                  color: 'var(--color-brand-orange)',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  background: 'rgba(249,115,22,0.05)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(249,115,22,0.12)'; el.style.borderColor = 'rgba(249,115,22,0.5)'; el.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'rgba(249,115,22,0.05)'; el.style.borderColor = 'rgba(249,115,22,0.25)'; el.style.transform = 'translateY(0)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              © 2025 RunClub Thailand · ทุกระยะทางมีความหมาย 🏃‍♂️
            </p>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (min-width: 1024px) {
          #left-panel  { display: flex !important; }
          #mobile-logo { display: none !important; }
          #right-panel {
            max-width: 520px !important;
            border-left: 1px solid rgba(255,255,255,0.05);
          }
        }
      `}</style>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */

function getPasswordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { score: 1, label: 'อ่อนแอมาก', color: '#ef4444' },
    { score: 2, label: 'ยังไม่แข็งแรงพอ', color: '#f97316' },
    { score: 3, label: 'แข็งแรงพอสมควร', color: '#f59e0b' },
    { score: 4, label: 'แข็งแรงมาก 💪', color: '#22c55e' },
  ]
  return map[score - 1] ?? { score: 0, label: '', color: 'transparent' }
}

/* ── Sub-components ── */

function LogoMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const big = size === 'lg'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: big ? '14px' : '10px' }}>
      <div
        className="glow-orange-sm"
        style={{
          width: big ? '52px' : '40px',
          height: big ? '52px' : '40px',
          borderRadius: big ? '14px' : '11px',
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: big ? '26px' : '20px',
          flexShrink: 0,
        }}
      >
        🏃
      </div>
      <div>
        <div
          className="font-display gradient-text-brand"
          style={{ fontSize: big ? '30px' : '22px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          RunClub
        </div>
        <div style={{ fontSize: big ? '13px' : '11px', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
          Thailand
        </div>
      </div>
    </div>
  )
}

function FormField({
  id, name, label, type = 'text', placeholder, value, onChange, error, icon,
}: {
  id: string; name: string; label: string; type?: string; placeholder: string
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; error?: string
  icon: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          className="input-dark"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            paddingLeft: '42px',
            paddingRight: '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderRadius: '12px',
            fontSize: '14px',
            borderColor: error ? 'rgba(239,68,68,0.5)' : undefined,
          }}
        />
      </div>
      {error && <ErrorText text={error} />}
    </div>
  )
}

function ErrorText({ text }: { text: string }) {
  return (
    <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {text}
    </p>
  )
}

function StepItem({ number, title, desc, isActive, isDone }: {
  number: string; title: string; desc: string; isActive: boolean; isDone: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          background: isDone
            ? 'linear-gradient(135deg, #f97316, #ef4444)'
            : isActive
            ? 'rgba(249,115,22,0.15)'
            : 'rgba(255,255,255,0.05)',
          border: isActive
            ? '2px solid rgba(249,115,22,0.5)'
            : isDone
            ? 'none'
            : '2px solid rgba(255,255,255,0.08)',
          color: isDone ? 'white' : isActive ? '#f97316' : 'var(--color-text-muted)',
          transition: 'all 0.3s ease',
        }}
      >
        {isDone
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          : number
        }
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: isActive ? 'var(--color-text-primary)' : isDone ? 'var(--color-text-secondary)' : 'var(--color-text-muted)', marginBottom: '2px', transition: 'color 0.3s' }}>
          {title}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

function BenefitCard({ icon, title, desc, style }: { icon: string; title: string; desc: string; style?: React.CSSProperties }) {
  return (
    <div
      className="glass-card"
      style={{ padding: '14px 18px', borderRadius: '14px', minWidth: '200px', animation: 'orbFloat 7s ease-in-out infinite', ...style }}
    >
      <div style={{ fontSize: '22px', marginBottom: '6px' }}>{icon}</div>
      <div className="font-display" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
        {title}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{desc}</div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
