import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/* ============================================================
   RunClub – Login Page
   Dark Mode / Orange-Red Brand / Glassmorphism
   ============================================================ */

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch {
      // error is already set in AuthContext
    }
  }

  return (
    <div
      className="bg-gradient-animated"
      style={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient Orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ══════════════════════════════════════════════
          LEFT PANEL – Brand / Hero
          ══════════════════════════════════════════════ */}
      <div
        className="fade-in-up"
        style={{
          display: 'none',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
          zIndex: 1,
        }}
        id="left-panel"
      >
        {/* Stats floating cards */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '5%',
            animation: 'orbFloat 6s ease-in-out infinite',
          }}
        >
          <StatCard icon="🏃" label="สมาชิกทั้งหมด" value="12,480" />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '10%',
            animation: 'orbFloat 8s ease-in-out infinite 2s',
          }}
        >
          <StatCard icon="🔥" label="กม. วิ่งสัปดาห์นี้" value="48,200" />
        </div>

        {/* Brand logo */}
        <div style={{ marginBottom: '40px' }}>
          <LogoMark size="lg" />
        </div>

        {/* Headline */}
        <h1
          className="font-display gradient-text-brand"
          style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}
        >
          วิ่งด้วยกัน
          <br />
          ไปด้วยกัน
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: 'var(--color-text-secondary)',
            maxWidth: '380px',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}
        >
          แพลตฟอร์มสำหรับชุมชนนักวิ่ง บันทึกระยะทาง ติดตามความก้าวหน้า
          และร่วมกิจกรรมกับเพื่อนๆ
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: '📍', text: 'ติดตาม GPS แบบเรียลไทม์' },
            { icon: '📊', text: 'วิเคราะห์สถิติการวิ่งเชิงลึก' },
            { icon: '🏆', text: 'ลีดเดอร์บอร์ดและความท้าทาย' },
            { icon: '👥', text: 'ชุมชนนักวิ่งทั่วประเทศ' },
          ].map((item) => (
            <FeatureItem key={item.icon} icon={item.icon} text={item.text} />
          ))}
        </div>

        {/* Running track decoration */}
        <div className="running-track" style={{ marginTop: '48px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="track-dot" />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT PANEL – Login Form
          ══════════════════════════════════════════════ */}
      <div
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
        id="right-panel"
      >
        <div
          style={{ width: '100%', maxWidth: '440px' }}
        >
          {/* Mobile logo */}
          <div
            className="fade-in-up"
            style={{ textAlign: 'center', marginBottom: '32px' }}
            id="mobile-logo"
          >
            <LogoMark size="sm" />
            <p
              style={{
                marginTop: '8px',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              วิ่งด้วยกัน ไปด้วยกัน
            </p>
          </div>

          {/* Login Card */}
          <div
            className="glass-card glow-orange-sm fade-in-up fade-in-up-delay-2"
            style={{
              borderRadius: '24px',
              padding: '40px 36px',
            }}
          >
            {/* Card Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="pulse-dot" />
                <span
                  style={{
                    fontSize: '12px',
                    color: '#22c55e',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  ระบบออนไลน์
                </span>
              </div>
              <h2
                className="font-display"
                style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}
              >
                ยินดีต้อนรับกลับ 👋
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                เข้าสู่ระบบเพื่อเริ่มวิ่งกับชุมชน
              </p>
            </div>

            {/* ── Error Banner ── */}
            {error && (
              <div
                id="login-error-banner"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  marginBottom: '20px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: '13px', color: '#ef4444', margin: 0, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Social Login Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <SocialButton
                id="btn-google-login"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                }
                label="Google"
              />
              <SocialButton
                id="btn-strava-login"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" fill="#fc4c02"/>
                  </svg>
                }
                label="Strava"
              />
            </div>

            {/* Divider */}
            <div className="divider-with-text" style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                หรือเข้าสู่ระบบด้วยอีเมล
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email-input"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '8px',
                    letterSpacing: '0.02em',
                  }}
                >
                  อีเมล
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    className="input-dark"
                    placeholder="runner@runclub.th"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    style={{
                      width: '100%',
                      paddingLeft: '42px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <label
                    htmlFor="password-input"
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    รหัสผ่าน
                  </label>
                  <a
                    href="#"
                    id="forgot-password-link"
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-brand-orange)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fb923c')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-brand-orange)')}
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    className="input-dark"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      paddingLeft: '42px',
                      paddingRight: '46px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    type="button"
                    id="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget).style.color = 'var(--color-text-secondary)')}
                    onMouseLeave={(e) => ((e.currentTarget).style.color = 'var(--color-text-muted)')}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label
                htmlFor="remember-me-checkbox"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '18px',
                    height: '18px',
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    id="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', margin: 0 }}
                  />
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: rememberMe
                        ? '2px solid #f97316'
                        : '2px solid rgba(255,255,255,0.15)',
                      background: rememberMe
                        ? 'linear-gradient(135deg, #f97316, #ef4444)'
                        : 'rgba(10,10,15,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      pointerEvents: 'none',
                    }}
                  >
                    {rememberMe && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', userSelect: 'none' }}>
                  จดจำการเข้าสู่ระบบ
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit-btn"
                className="btn-brand"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '15px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isLoading ? 0.8 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ margin: '28px 0 0' }}>
              <div className="divider-with-text" style={{ marginBottom: '0' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  ยังไม่มีบัญชี?
                </span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link
                  to="/register"
                  id="register-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                    color: 'var(--color-brand-orange)',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    background: 'rgba(249, 115, 22, 0.05)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(249, 115, 22, 0.12)'
                    el.style.borderColor = 'rgba(249, 115, 22, 0.5)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(249, 115, 22, 0.05)'
                    el.style.borderColor = 'rgba(249, 115, 22, 0.25)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  สมัครสมาชิกใหม่
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="fade-in-up fade-in-up-delay-5"
            style={{ textAlign: 'center', marginTop: '24px' }}
          >
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              © 2025 RunClub Thailand · ทุกระยะทางมีความหมาย 🏃‍♂️
            </p>
          </div>
        </div>
      </div>

      {/* Responsive style override – show left panel on large screens */}
      <style>{`
        @media (min-width: 1024px) {
          #left-panel  { display: flex !important; }
          #mobile-logo { display: none !important; }
          #right-panel {
            max-width: 500px !important;
            border-left: 1px solid rgba(255,255,255,0.05);
          }
        }
      `}</style>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────── */
/*  Sub-components                                              */
/* ──────────────────────────────────────────────────────────── */

function LogoMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const big = size === 'lg'
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: big ? '14px' : '10px' }}>
      {/* Icon */}
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
      {/* Text */}
      <div>
        <div
          className="font-display gradient-text-brand"
          style={{
            fontSize: big ? '30px' : '22px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          RunClub
        </div>
        <div
          style={{
            fontSize: big ? '13px' : '11px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Thailand
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '15px',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{text}</span>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '14px 18px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '180px',
      }}
    >
      <span style={{ fontSize: '22px' }}>{icon}</span>
      <div>
        <div
          className="font-display"
          style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}
        >
          {value}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '1px' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function SocialButton({
  id,
  icon,
  label,
}: {
  id: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      id={id}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '11px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        color: 'var(--color-text-secondary)',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.08)'
        el.style.borderColor = 'rgba(255,255,255,0.16)'
        el.style.color = 'var(--color-text-primary)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(255,255,255,0.04)'
        el.style.borderColor = 'rgba(255,255,255,0.08)'
        el.style.color = 'var(--color-text-secondary)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function LoadingSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
